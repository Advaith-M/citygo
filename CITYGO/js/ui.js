/* ==========================================================================
   CITYGO SYSTEM ARCHITECTURE - UI & MODAL INTERACTION MANAGER
   ==========================================================================
   File Name: js/ui.js
   Role: Renders sidebar shop cards, manages filter badge states, handles
         the slide-out detailed venue modal, and handles gallery previews.
   Dependencies: shop.js, map.js
   ========================================================================== */

class CityGoUI {
  /**
   * @param {Object} appController Main application instance reference
   */
  constructor(appController) {
    this.app = appController;
    this.activeShopId = null;

    // Cache Core DOM Containers
    this.cardsContainer = document.getElementById("shop-cards-container");
    this.resultsCountEl = document.getElementById("results-count");
    this.detailPanelEl = document.getElementById("luxury-detail-panel");

    this.initGlobalEvents();
  }

  /**
   * Binds global UI event listeners (e.g., ESC key to close modal).
   */
  initGlobalEvents() {
    // Close slide-out detail panel on Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.activeShopId) {
        this.closeVenue();
      }
    });
  }

  /**
   * Updates the results counter header in the sidebar.
   * @param {number} count Number of active filtered venues
   */
  updateResultsCount(count) {
    if (this.resultsCountEl) {
      const noun = count === 1 ? "venue" : "venues";
      this.resultsCountEl.innerHTML = `Showing <strong>${count}</strong> ${noun}`;
    }
  }

  /**
   * Renders shop cards in the sidebar directory listing.
   * @param {Array} shops Array of venue objects to render
   */
  renderShopCards(shops) {
    if (!this.cardsContainer) return;

    // Empty State Rendering
    if (!shops || shops.length === 0) {
      this.cardsContainer.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">No Venues Found</h3>
          <p class="empty-desc">We couldn't find any places matching your current search or category filter.</p>
          <button class="bubbly-button-secondary" onclick="window.cityGoApp.setCategory('all'); document.getElementById('search-input').value=''; window.cityGoApp.refreshState();">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    // Dynamic Shop Card HTML Construction
    this.cardsContainer.innerHTML = shops.map((shop) => {
      const isActive = shop.id === this.activeShopId ? "card-active" : "";
      
      return `
        <article 
          class="bubbly-card ${isActive}" 
          data-shop-id="${shop.id}"
          onclick="window.cityGoUI.openVenue('${shop.id}')"
          tabindex="0"
          role="button"
          aria-label="View details for ${shop.name}"
        >
          <div class="card-image-wrap">
            <img src="${shop.thumbnail}" alt="${shop.name}" loading="lazy" />
            <span class="card-price-badge">${shop.priceRange}</span>
          </div>

          <div class="card-content">
            <div class="card-header-row">
              <span class="card-category">${shop.categoryLabel}</span>
              <span class="rating-pill">★ ${shop.rating.toFixed(1)}</span>
            </div>

            <h3 class="card-title">${shop.name}</h3>

            <p class="card-address-subtle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${shop.address}
            </p>

            <div class="card-footer-meta">
              <span class="reviews-count">${shop.reviewsCount} verified reviews</span>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  /**
   * Opens the slide-out detail panel for a specific shop and focuses map view.
   * @param {string} shopId Unique identifier for shop venue
   */
  openVenue(shopId) {
    const shop = CITYGO_DATABASE.find((s) => s.id === shopId);
    if (!shop) {
      console.warn(`[CityGO UI] Venue with ID "${shopId}" not found in database.`);
      return;
    }

    this.activeShopId = shopId;

    // Highlight card in sidebar list
    document.querySelectorAll(".bubbly-card").forEach((card) => {
      if (card.dataset.shopId === shopId) {
        card.classList.add("card-active");
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        card.classList.remove("card-active");
      }
    });

    // Fly Map Camera to Venue Location
    if (this.app && this.app.mapEngine) {
      this.app.mapEngine.flyTo(shop.lat, shop.lng, 16);
    }

    // Render Detailed Slide-Out Panel Content
    if (this.detailPanelEl) {
      this.detailPanelEl.innerHTML = `
        <button class="panel-close-btn" onclick="window.cityGoUI.closeVenue()" aria-label="Close detail panel">
          ✕
        </button>

        <div class="detail-header-hero">
          <img src="${shop.thumbnail}" alt="${shop.name}" class="detail-hero-image" />
          <div class="detail-hero-overlay">
            <span class="detail-category-badge">${shop.categoryLabel}</span>
            <h2 class="detail-title">${shop.name}</h2>
          </div>
        </div>

        <div class="detail-body-content">
          <div class="detail-quick-stats">
            <div class="stat-pill">
              <span class="stat-label">Rating</span>
              <span class="stat-value">★ ${shop.rating.toFixed(1)}</span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Pricing</span>
              <span class="stat-value">${shop.priceRange}</span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Hours</span>
              <span class="stat-value">${shop.hours}</span>
            </div>
          </div>

          <div class="detail-section">
            <h3>About This Venue</h3>
            <p class="detail-description">${shop.description}</p>
            <p class="detail-address"><strong>Address:</strong> ${shop.address}</p>
          </div>

          ${
            shop.gallery && shop.gallery.length > 0
              ? `
            <div class="detail-section">
              <h3>Gallery</h3>
              <div class="detail-gallery-grid">
                ${shop.gallery
                  .map(
                    (imgUrl) => `
                  <div class="gallery-item-wrap" onclick="window.cityGoUI.previewImage('${imgUrl}')">
                    <img src="${imgUrl}" alt="Venue photo" loading="lazy" />
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }

          ${
            shop.reviews && shop.reviews.length > 0
              ? `
            <div class="detail-section">
              <h3>Community Reviews</h3>
              <div class="detail-reviews-list">
                ${shop.reviews
                  .map(
                    (review) => `
                  <div class="review-card-bubbly">
                    <div class="review-header">
                      <strong class="review-author">${review.author}</strong>
                      <span class="review-stars">${"★".repeat(review.rating)}</span>
                    </div>
                    <p class="review-comment">"${review.comment}"</p>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }

          <div class="detail-action-footer">
            <button class="bubbly-button-primary" onclick="alert('✨ Reservation request submitted for ${shop.name}!')">
              ✨ Reserve A Visit
            </button>
          </div>
        </div>
      `;

      // Show Slide-Out Panel with CSS Animation
      this.detailPanelEl.classList.remove("panel-hidden");
    }
  }

  /**
   * Closes the detailed venue slide-out modal panel.
   */
  closeVenue() {
    this.activeShopId = null;

    if (this.detailPanelEl) {
      this.detailPanelEl.classList.add("panel-hidden");
    }

    // Remove active highlight state from cards
    document.querySelectorAll(".bubbly-card").forEach((card) => {
      card.classList.remove("card-active");
    });
  }

  /**
   * Opens full-size photo preview alert or modal overlay.
   * @param {string} imageUrl URL of image to display
   */
  previewImage(imageUrl) {
    window.open(imageUrl, "_blank");
  }
}

// Global UI Manager Singleton Binding
window.CityGoUIManager = CityGoUI;