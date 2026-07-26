/* ==========================================================================
   CITYGO SYSTEM ARCHITECTURE - INTERACTIVE MAP ENGINE
   ==========================================================================
   File Name: js/map.js
   Role: Initializes Leaflet GIS viewport, renders custom radar map pins,
         manages tile layers, and executes camera fly-to animations.
   Dependencies: Leaflet.js (L)
   ========================================================================== */

class CityGoMap {
  /**
   * @param {string} viewportId DOM Container ID for the map instance
   */
  constructor(viewportId) {
    this.viewportId = viewportId;
    this.map = null;
    this.markersGroup = null;
    this.markersMap = new Map(); // Fast lookup table for shop ID -> Marker object
    this.defaultCenter = [40.7128, -74.0060];
    this.defaultZoom = 13;
    
    // Carto Voyager Light Tile Layer URL
    this.lightTileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    this.tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
  }

  /**
   * Initializes the Leaflet map instance and attaches initial event handlers.
   * @param {Array<number>} center Lat/Lng array [lat, lng]
   * @param {number} zoom Initial zoom level integer
   */
  init(center = this.defaultCenter, zoom = this.defaultZoom) {
    this.defaultCenter = center;
    this.defaultZoom = zoom;

    const mapContainer = document.getElementById(this.viewportId);
    if (!mapContainer) {
      console.error(`❌ [CityGO Map] Container #${this.viewportId} not found in DOM.`);
      return;
    }

    // 1. Initialize Map Instance
    this.map = L.map(this.viewportId, {
      zoomControl: false, // Built-in controls removed in favor of custom UI
      attributionControl: false
    }).setView(center, zoom);

    // 2. Add Bright White Carto Voyager Tile Layer
    L.tileLayer(this.lightTileUrl, {
      attribution: this.tileAttribution,
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    // 3. Add Custom Bottom-Right Zoom Controls
    L.control.zoom({ position: "bottomright" }).addTo(this.map);

    // 4. Initialize Layer Group for Pins
    this.markersGroup = L.layerGroup().addTo(this.map);

    // 5. Hide Loading Spinner once tiles begin loading
    const loader = document.getElementById("map-loader");
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 400);
      }, 500);
    }

    console.log("📍 [CityGO Map] GIS Map Engine initialized successfully.");
  }

  /**
   * Clears existing pins and draws custom bubbly radar markers for given venues.
   * @param {Array} shops Array of venue database records
   * @param {Function} onSelectCallback Handler invoked when a map pin is clicked
   */
  renderMarkers(shops, onSelectCallback) {
    if (!this.map || !this.markersGroup) return;

    // Clear previous markers
    this.clearMarkers();

    if (!shops || shops.length === 0) return;

    const bounds = L.latLngBounds();

    shops.forEach((shop) => {
      if (typeof shop.lat !== 'number' || typeof shop.lng !== 'number') return;

      const position = [shop.lat, shop.lng];
      bounds.extend(position);

      // Create Custom Bubbly Radar Pin HTML Icon
      const customIcon = L.divIcon({
        className: "bubbly-map-marker-wrap",
        html: `
          <div class="bubbly-map-marker" data-shop-id="${shop.id}">
            <div class="marker-pulse-ring"></div>
            <div class="marker-inner-core">
              <span class="marker-emoji">${this.getCategoryEmoji(shop.category)}</span>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -20]
      });

      // Construct Leaflet Marker
      const marker = L.marker(position, { icon: customIcon });

      // Construct Popup Content Card
      const popupHtml = `
        <div class="luxury-popup-card">
          <span class="popup-category">${shop.categoryLabel}</span>
          <h4 class="popup-title">${shop.name}</h4>
          <div class="popup-meta">
            <span class="popup-rating">★ ${shop.rating.toFixed(1)}</span>
            <span class="popup-price">${shop.priceRange}</span>
          </div>
          <button class="bubbly-button-popup" onclick="window.cityGoUI.openVenue('${shop.id}')">
            Explore Venue ✨
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: false,
        className: "bubbly-leaflet-popup"
      });

      // Click Event Listener
      marker.on("click", () => {
        if (typeof onSelectCallback === "function") {
          onSelectCallback(shop.id);
        }
      });

      // Add to Layer Group & Lookup Table
      this.markersGroup.addLayer(marker);
      this.markersMap.set(shop.id, marker);
    });
  }

  /**
   * Smoothly animates camera to target coordinates.
   * @param {number} lat Latitude
   * @param {number} lng Longitude
   * @param {number} zoom Target zoom level
   */
  flyTo(lat, lng, zoom = 16) {
    if (this.map) {
      this.map.flyTo([lat, lng], zoom, {
        duration: 1.4,
        easeLinearity: 0.25
      });

      // Open associated popup if marker exists
      const targetShop = CITYGO_DATABASE.find(s => s.lat === lat && s.lng === lng);
      if (targetShop && this.markersMap.has(targetShop.id)) {
        const marker = this.markersMap.get(targetShop.id);
        setTimeout(() => marker.openPopup(), 1200);
      }
    }
  }

  /**
   * Resets map view back to initial default view.
   */
  recenterDefault() {
    if (this.map) {
      this.map.flyTo(this.defaultCenter, this.defaultZoom, { duration: 1.2 });
    }
  }

  /**
   * Removes all current markers from map layer.
   */
  clearMarkers() {
    if (this.markersGroup) {
      this.markersGroup.clearLayers();
    }
    this.markersMap.clear();
  }

  /**
   * Helper utility returning category icon emojis.
   * @param {string} category Category key identifier
   * @returns {string} Emoji string
   */
  getCategoryEmoji(category) {
    switch (category) {
      case "bakery": return "🥐";
      case "restaurant": return "🍷";
      case "cafe": return "☕";
      case "spa": return "🌸";
      default: return "✨";
    }
  }
}

// Global Singleton Map Instance Binding
window.CityGoMapEngine = CityGoMap;