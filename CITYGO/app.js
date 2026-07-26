/* ==========================================================================
   CITYGO SYSTEM ARCHITECTURE - MASTER APPLICATION CONTROLLER ENGINE
   ==========================================================================
   File Name: js/app.js
   Role: Binds state management, category filtering, instant live search,
         sort controls, map-to-UI sync, and lifecycle initialization.
   Dependencies: shop.js, map.js, ui.js
   ========================================================================== */

class CityGoAppController {
  constructor() {
    // Initial State Management
    this.shops = typeof CITYGO_DATABASE !== 'undefined' ? CITYGO_DATABASE : [];
    this.filteredShops = [...this.shops];
    this.activeCategory = "all";
    this.currentSearchQuery = "";
    this.currentSortBy = "rating";
    
    // Engine References
    this.mapEngine = null;
    this.uiManager = null;

    // Available Directory Categories
    this.categories = [
      { id: "all", label: "✨ All Places", icon: "sparkles" },
      { id: "bakery", label: "🥐 Bakeries", icon: "croissant" },
      { id: "restaurant", label: "🍷 Fine Dining", icon: "wine" },
      { id: "cafe", label: "☕ Specialty Cafes", icon: "coffee" },
      { id: "spa", label: "🌸 Spas & Wellness", icon: "flower" }
    ];
  }

  /**
   * Initializes the entire application state when DOM is ready.
   */
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("🚀 [CityGO Core] Initializing Master Engine...");

      // 1. Initialize Interactive Map Engine
      this.initMapEngine();

      // 2. Initialize UI Rendering Engine
      this.initUIManager();

      // 3. Bind All Event Listeners (Search, Filters, Map Controls)
      this.bindEventListeners();

      // 4. Perform Initial State Sync & Render
      this.refreshState();

      console.log("✨ [CityGO Core] Application online & ready!");
    });
  }

  /**
   * Instantiates the Leaflet GIS Map Controller.
   */
  initMapEngine() {
    try {
      if (window.CityGoMapEngine) {
        this.mapEngine = new window.CityGoMapEngine("map-viewport");
        this.mapEngine.init([40.7128, -74.0060], 13);
      } else {
        console.error("❌ [CityGO Map] Map engine library not detected.");
      }
    } catch (error) {
      console.error("❌ [CityGO Map] Failed to initialize map engine:", error);
    }
  }

  /**
   * Instantiates the UI & Modal Manager.
   */
  initUIManager() {
    try {
      if (window.CityGoUIManager) {
        this.uiManager = new window.CityGoUIManager(this);
        window.cityGoUI = this.uiManager;
      } else {
        console.error("❌ [CityGO UI] UI Manager library not detected.");
      }
    } catch (error) {
      console.error("❌ [CityGO UI] Failed to initialize UI manager:", error);
    }
  }

  /**
   * Registers DOM event listeners for search inputs, category chips, and map buttons.
   */
  bindEventListeners() {
    // 1. Search Bar Input Event (Live Real-Time Filtering)
    const searchInput = document.getElementById("search-input");
    const clearBtn = document.getElementById("search-clear-btn");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.currentSearchQuery = e.target.value.trim().toLowerCase();
        
        // Show/Hide Clear Button dynamically
        if (clearBtn) {
          if (this.currentSearchQuery.length > 0) {
            clearBtn.classList.remove("hidden");
          } else {
            clearBtn.classList.add("hidden");
          }
        }

        this.refreshState();
      });
    }

    // 2. Search Clear Button Event
    if (clearBtn && searchInput) {
      clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        this.currentSearchQuery = "";
        clearBtn.classList.add("hidden");
        searchInput.focus();
        this.refreshState();
      });
    }

    // 3. Category Filter Chips (Delegated Event Handling)
    const categoryContainer = document.getElementById("filter-carousel");
    if (categoryContainer) {
      categoryContainer.addEventListener("click", (e) => {
        const tag = e.target.closest(".bubbly-tag");
        if (tag) {
          const catId = tag.dataset.category || "all";
          this.setCategory(catId);
        }
      });
    }

    // 4. Sort Selector Event
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSortBy = e.target.value;
        this.refreshState();
      });
    }

    // 5. Recenter Map Viewport Button
    const recenterBtn = document.getElementById("recenter-map-btn");
    if (recenterBtn) {
      recenterBtn.addEventListener("click", () => {
        if (this.mapEngine) {
          this.mapEngine.recenterDefault();
        }
      });
    }
  }

  /**
   * Sets active category filter and triggers UI update.
   * @param {string} categoryId 
   */
  setCategory(categoryId) {
    this.activeCategory = categoryId;

    // Update active visual state on category tags
    const tags = document.querySelectorAll(".bubbly-tag");
    tags.forEach(tag => {
      if (tag.dataset.category === categoryId) {
        tag.classList.add("active");
      } else {
        tag.classList.remove("active");
      }
    });

    this.refreshState();
  }

  /**
   * Filters, sorts, and re-renders both the directory cards and map pins.
   */
  refreshState() {
    // Phase 1: Filter database array by Category & Search Query
    this.filteredShops = this.shops.filter(shop => {
      const matchesCategory = (this.activeCategory === "all") || (shop.category === this.activeCategory);
      
      const matchesSearch = (this.currentSearchQuery === "") ||
        shop.name.toLowerCase().includes(this.currentSearchQuery) ||
        shop.categoryLabel.toLowerCase().includes(this.currentSearchQuery) ||
        shop.address.toLowerCase().includes(this.currentSearchQuery) ||
        shop.description.toLowerCase().includes(this.currentSearchQuery);

      return matchesCategory && matchesSearch;
    });

    // Phase 2: Sort filtered array
    this.sortShops();

    // Phase 3: Render shop cards in sidebar
    if (this.uiManager) {
      this.uiManager.renderShopCards(this.filteredShops);
      this.uiManager.updateResultsCount(this.filteredShops.length);
    }

    // Phase 4: Sync map markers with filtered venues
    if (this.mapEngine) {
      this.mapEngine.renderMarkers(this.filteredShops, (selectedShopId) => {
        if (this.uiManager) {
          this.uiManager.openVenue(selectedShopId);
        }
      });
    }
  }

  /**
   * Sorts `filteredShops` in place according to `currentSortBy`.
   */
  sortShops() {
    switch (this.currentSortBy) {
      case "rating":
        this.filteredShops.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        this.filteredShops.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "reviews":
        this.filteredShops.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      default:
        this.filteredShops.sort((a, b) => b.rating - a.rating);
        break;
    }
  }
}

// Global Singleton Application Controller
window.cityGoApp = new CityGoAppController();
window.cityGoApp.init();