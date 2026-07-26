/* ==========================================================================
   CITYGO MAP CONTROLLER ENGINE
   ========================================================================== */

class CityGoMap {
  constructor(viewportId) {
    this.viewportId = viewportId;
    this.map = null;
    this.markers = [];
  }

  init(defaultCoords = [40.7128, -74.0060], zoomLevel = 14) {
    this.map = L.map(this.viewportId, {
      zoomControl: false
    }).setView(defaultCoords, zoomLevel);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; CityGO Directory',
      maxZoom: 19
    }).addTo(this.map);

    L.control.zoom({ position: "bottomright" }).addTo(this.map);
  }

  renderMarkers(shops, onSelectCallback) {
    this.clearMarkers();

    shops.forEach(shop => {
      const customIcon = L.divIcon({
        className: "bubbly-map-marker",
        html: `
          <div class="marker-pulse-ring"></div>
          <div class="marker-inner-core"></div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([shop.lat, shop.lng], { icon: customIcon }).addTo(this.map);

      const popupHtml = `
        <div class="luxury-popup-card">
          <h4>${shop.name}</h4>
          <p>${shop.categoryLabel} • ${shop.priceRange}</p>
          <button class="bubbly-button" style="padding: 6px 14px; font-size: 0.8rem;" onclick="window.cityGoUI.openVenue('${shop.id}')">
            Explore Venue
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      this.markers.push(marker);
    });
  }

  flyTo(lat, lng, zoom = 16) {
    if (this.map) {
      this.map.flyTo([lat, lng], zoom, { duration: 1.5 });
    }
  }

  clearMarkers() {
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];
  }
}

window.CityGoMapEngine = CityGoMap;
