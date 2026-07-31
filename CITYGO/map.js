/**
 * ==========================================================================
 * CITYGO VECTOR GIS ENGINE — MASTER LOGIC (map.js)
 * Production-Grade MapLibre GL JS Vector Integration & Spatial UI Controller
 * ==========================================================================
 */

'use strict';

/* ==========================================================================
   1. REAL-WORLD DISTRICT & VENUE DATASETS
   ========================================================================== */

const MAP_STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  satellite: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
};

const DISTRICT_PRESETS = {
  'tokyo-shibuya': {
    name: 'Shibuya & Harajuku',
    city: 'Tokyo, Japan',
    center: [139.7016, 35.6580],
    zoom: 16.8,
    pitch: 50,
    bearing: -15
  },
  'tokyo-shinjuku': {
    name: 'Shinjuku Central',
    city: 'Tokyo, Japan',
    center: [139.7006, 35.6895],
    zoom: 16.5,
    pitch: 45,
    bearing: 20
  },
  'tokyo-ginza': {
    name: 'Ginza & Marunouchi',
    city: 'Tokyo, Japan',
    center: [139.7671, 35.6719],
    zoom: 16.7,
    pitch: 40,
    bearing: -10
  },
  'ny-manhattan': {
    name: 'Midtown Manhattan',
    city: 'New York, USA',
    center: [-73.9855, 40.7580],
    zoom: 16.4,
    pitch: 55,
    bearing: 28
  },
  'london-soho': {
    name: 'Soho & West End',
    city: 'London, UK',
    center: [-0.1337, 51.5132],
    zoom: 16.8,
    pitch: 45,
    bearing: -5
  },
  'paris-centre': {
    name: 'Le Marais',
    city: 'Paris, France',
    center: [2.3585, 48.8570],
    zoom: 16.9,
    pitch: 40,
    bearing: 12
  }
};

const REAL_VENUES_DATABASE = [
  // --- TOKYO: SHIBUYA ---
  {
    id: 'v101',
    district: 'tokyo-shibuya',
    name: 'Shibuya 109 Fashion Tower',
    category: 'SHOPPING',
    subcategory: 'Department Store & High Fashion',
    emoji: '🛍️',
    coords: [139.6994, 35.6595],
    rating: 4.8,
    reviews: 1420,
    openNow: true,
    hours: '10:00 - 21:00',
    address: '2-29-1 Dogenzaka, Shibuya, Tokyo'
  },
  {
    id: 'v102',
    district: 'tokyo-shibuya',
    name: 'Tower Records Shibuya',
    category: 'CULTURE',
    subcategory: 'Flagship Music & Books',
    emoji: '🎨',
    coords: [139.7011, 35.6612],
    rating: 4.9,
    reviews: 3100,
    openNow: true,
    hours: '11:00 - 22:00',
    address: '1-22-14 Jinnan, Shibuya, Tokyo'
  },
  {
    id: 'v103',
    district: 'tokyo-shibuya',
    name: 'Fuglen Tokyo Roastery',
    category: 'CAFE',
    subcategory: 'Artisan Espresso Bar & Cocktail Lounge',
    emoji: '☕',
    coords: [139.6953, 35.6638],
    rating: 4.7,
    reviews: 890,
    openNow: true,
    hours: '07:00 - 22:00',
    address: '1-16-11 Tomigaya, Shibuya, Tokyo'
  },
  {
    id: 'v104',
    district: 'tokyo-shibuya',
    name: 'Ichiran Ramen Shibuya',
    category: 'DINING',
    subcategory: 'Tonkotsu Specialty Noodle Booths',
    emoji: '🍜',
    coords: [139.7008, 35.6603],
    rating: 4.8,
    reviews: 4200,
    openNow: true,
    hours: '24 Hours Open',
    address: '1-22-7 Jinnan, Shibuya, Tokyo'
  },
  {
    id: 'v105',
    district: 'tokyo-shibuya',
    name: 'Bar Trench Speakeasy',
    category: 'BAR',
    subcategory: 'Craft Cocktail Den',
    emoji: '🍸',
    coords: [139.7065, 35.6482],
    rating: 4.9,
    reviews: 650,
    openNow: false,
    hours: '18:00 - 02:00',
    address: '1-5-8 Ebisu-Nishi, Shibuya, Tokyo'
  },

  // --- NEW YORK: MANHATTAN ---
  {
    id: 'v201',
    district: 'ny-manhattan',
    name: 'Katz’s Delicatessen',
    category: 'DINING',
    subcategory: 'Historic Jewish Deli & Pastrami',
    emoji: '🥪',
    coords: [-73.9872, 40.7222],
    rating: 4.7,
    reviews: 9500,
    openNow: true,
    hours: '08:00 - 23:00',
    address:205 'Houston St, New York, NY'
  },
  {
    id: 'v202',
    district: 'ny-manhattan',
    name: 'Devoción Specialty Coffee',
    category: 'CAFE',
    subcategory: 'Farm-to-Table Colombian Roastery',
    emoji: '☕',
    coords: [-73.9880, 40.7405],
    rating: 4.8,
    reviews: 1120,
    openNow: true,
    hours: '08:00 - 19:00',
    address: '25 E 20th St, New York, NY'
  },
  {
    id: 'v203',
    district: 'ny-manhattan',
    name: 'MoMA Design Store',
    category: 'SHOPPING',
    subcategory: 'Modern Art & Industrial Design',
    emoji: '🛍️',
    coords: [-73.9769, 40.7614],
    rating: 4.9,
    reviews: 1840,
    openNow: true,
    hours: '10:00 - 18:30',
    address: '44 W 53rd St, New York, NY'
  },

  // --- LONDON: SOHO ---
  {
    id: 'v301',
    district: 'london-soho',
    name: 'Bao Soho',
    category: 'DINING',
    subcategory: 'Taiwanese Steamed Buns & Tea',
    emoji: '🥟',
    coords: [-0.1349, 51.5138],
    rating: 4.7,
    reviews: 1530,
    openNow: true,
    hours: '12:00 - 22:00',
    address: '53 Lexington St, Soho, London'
  },
  {
    id: 'v302',
    district: 'london-soho',
    name: 'Bar Termini',
    category: 'BAR',
    subcategory: 'Italian Negroni & Espresso Bar',
    emoji: '🍸',
    coords: [-0.1308, 51.5131],
    rating: 4.8,
    reviews: 980,
    openNow: true,
    hours: '11:00 - 23:30',
    address: '7 Old Compton St, Soho, London'
  }
];

/* ==========================================================================
   2. STATE MANAGEMENT & GLOBALS
   ========================================================================== */

class CityGoEngine {
  constructor() {
    this.map = null;
    this.currentTheme = 'light';
    this.currentDistrictKey = 'tokyo-shibuya';
    this.activeCategory = 'ALL';
    this.searchQuery = '';
    this.openNowOnly = false;
    this.sortBy = 'popular';
    
    this.markersMap = new Map(); // venueId -> MapLibre Marker instance
    this.activeVenue = null;
    this.is3DEnabled = true;

    this.dom = {
      districtSelect: document.getElementById('district-dropdown'),
      telemetryCoords: document.getElementById('telemetry-coords'),
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      sidebarPanel: document.getElementById('sidebar-panel'),
      sidebarCollapseBtn: document.getElementById('sidebar-collapse-btn'),
      searchInput: document.getElementById('search-input'),
      searchClearBtn: document.getElementById('search-clear-btn'),
      filterChipsContainer: document.getElementById('filter-chips'),
      openNowCheckbox: document.getElementById('open-now-checkbox'),
      sortDropdown: document.getElementById('sort-dropdown'),
      venueCountText: document.getElementById('venue-count'),
      shopCardsList: document.getElementById('shop-cards-list'),
      mapStatusPill: document.getElementById('map-status'),
      hudZoomVal: document.getElementById('hud-zoom-val'),
      hudPitchVal: document.getElementById('hud-pitch-val'),
      
      // Floating Control Capsule Buttons
      btn3D: document.getElementById('btn-3d-toggle'),
      btnSatellite: document.getElementById('btn-satellite-toggle'),
      btnRecenter: document.getElementById('btn-recenter'),
      btnRadar: document.getElementById('btn-radar'),
      
      // Modal Drawer
      venueModal: document.getElementById('venue-modal'),
      modalCloseBtn: document.getElementById('modal-close'),
      modalIcon: document.getElementById('modal-icon'),
      modalCategory: document.getElementById('modal-category'),
      modalTitle: document.getElementById('modal-title'),
      modalSubtitle: document.getElementById('modal-subtitle'),
      modalAddress: document.getElementById('modal-address'),
      modalHours: document.getElementById('modal-hours'),
      modalRating: document.getElementById('modal-rating'),
      btnDirections: document.getElementById('btn-directions'),
      btnBookmark: document.getElementById('btn-bookmark')
    };

    this.init();
  }

  /* ==========================================================================
     3. INITIALIZATION & MAP SETUP
     ========================================================================== */

  init() {
    const defaultDistrict = DISTRICT_PRESETS[this.currentDistrictKey];

    // Initialize MapLibre GL JS Instance
    this.map = new maplibregl.Map({
      container: 'map-viewport',
      style: MAP_STYLES[this.currentTheme],
      center: defaultDistrict.center,
      zoom: defaultDistrict.zoom,
      pitch: defaultDistrict.pitch,
      bearing: defaultDistrict.bearing,
      antialias: true,
      maxZoom: 20,
      minZoom: 12
    });

    // Add Native Controls
    this.map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');

    // Register Map Event Listeners
    this.map.on('load', () => this.onMapLoaded());
    this.map.on('move', () => this.updateTelemetryHUD());

    // Register UI Controls
    this.bindUIEvents();
  }

  onMapLoaded() {
    this.addBuilding3DLayers();
    this.renderVenuesForCurrentDistrict();
    this.hideMapStatus();
    this.updateTelemetryHUD();
  }

  /* ==========================================================================
     4. MAP LAYERS & 3D VECTOR EXTRUSION
     ========================================================================== */

  addBuilding3DLayers() {
    if (!this.map) return;

    // Check if style has building layers for 3D extrusion
    const layers = this.map.getStyle().layers;
    let labelLayerId;
    
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && layers[i].layout && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        break;
      }
    }

    if (!this.map.getLayer('3d-buildings') && this.map.getSource('openmaptiles')) {
      this.map.addLayer(
        {
          id: '3d-buildings',
          source: 'openmaptiles',
          'source-layer': 'building',
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'render_height'],
              0, '#e2e8f0',
              50, '#cbd5e1',
              100, '#94a3b8'
            ],
            'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'render_height']],
            'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'render_min_height']],
            'fill-extrusion-opacity': 0.75
          }
        },
        labelLayerId
      );
    }
  }

  /* ==========================================================================
     5. MARKER MANAGEMENT & FEED RENDERING
     ========================================================================== */

  clearMarkers() {
    this.markersMap.forEach(marker => marker.remove());
    this.markersMap.clear();
  }

  getFilteredVenues() {
    return REAL_VENUES_DATABASE.filter(venue => {
      // District Match
      if (venue.district !== this.currentDistrictKey) return false;

      // Category Match
      if (this.activeCategory !== 'ALL' && venue.category !== this.activeCategory) {
        return false;
      }

      // Open Now Match
      if (this.openNowOnly && !venue.openNow) return false;

      // Search Filter
      if (this.searchQuery.trim() !== '') {
        const query = this.searchQuery.toLowerCase();
        const matchesName = venue.name.toLowerCase().includes(query);
        const matchesSub = venue.subcategory.toLowerCase().includes(query);
        const matchesCat = venue.category.toLowerCase().includes(query);
        if (!matchesName && !matchesSub && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (this.sortBy === 'rating') return b.rating - a.rating;
      if (this.sortBy === 'popular') return b.reviews - a.reviews;
      return 0;
    });
  }

  renderVenuesForCurrentDistrict() {
    this.clearMarkers();
    const venues = this.getFilteredVenues();

    // Update Counts in UI
    this.dom.venueCountText.innerText = venues.length;
    this.dom.shopCardsList.innerHTML = '';

    if (venues.length === 0) {
      this.dom.shopCardsList.innerHTML = `
        <div style="text-align: center; padding: 30px 10px; color: var(--text-muted);">
          <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
          <p style="font-weight: 600;">No spots found</p>
          <p style="font-size: 11px;">Try adjusting your filters or search terms.</p>
        </div>
      `;
      return;
    }

    venues.forEach(venue => {
      // 1. Create Custom DOM Marker Element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-vector-marker';
      markerEl.innerHTML = `<span>${venue.emoji}</span><div class="marker-pulse"></div>`;

      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectVenue(venue);
      });

      // 2. Instantiate MapLibre Marker
      const marker = new maplibregl.Marker({ element: markerEl })
        .setLngLat(venue.coords)
        .addTo(this.map);

      this.markersMap.set(venue.id, marker);

      // 3. Render Card in Sidebar Feed
      const cardEl = document.createElement('article');
      cardEl.className = 'compact-card';
      cardEl.innerHTML = `
        <div class="card-icon-box">${venue.emoji}</div>
        <div class="card-details">
          <span class="card-category-tag">${venue.category}</span>
          <h3 class="card-title-text">${venue.name}</h3>
          <p class="card-subtitle-text">${venue.subcategory}</p>
          <div class="card-meta-row">
            <span class="rating-badge">⭐ ${venue.rating}</span>
            <span class="distance-badge">${venue.openNow ? '🟢 Open' : '🔴 Closed'}</span>
          </div>
        </div>
      `;

      cardEl.addEventListener('click', () => {
        this.selectVenue(venue);
        this.flyToLocation(venue.coords, 17.5, 55);
      });

      this.dom.shopCardsList.appendChild(cardEl);
    });
  }

  selectVenue(venue) {
    this.activeVenue = venue;

    // Highlight Active Marker Pin
    this.markersMap.forEach((marker, id) => {
      const el = marker.getElement();
      if (id === venue.id) {
        el.classList.add('active-pin');
      } else {
        el.classList.remove('active-pin');
      }
    });

    // Populate Modal Drawer Content
    this.dom.modalIcon.innerText = venue.emoji;
    this.dom.modalCategory.innerText = venue.category;
    this.dom.modalTitle.innerText = venue.name;
    this.dom.modalSubtitle.innerText = venue.subcategory;
    this.dom.modalAddress.innerText = venue.address;
    this.dom.modalHours.innerText = `${venue.openNow ? 'Open Now' : 'Closed'} (${venue.hours})`;
    this.dom.modalHours.className = `tile-val ${venue.openNow ? 'text-success' : ''}`;
    this.dom.modalRating.innerText = `⭐ ${venue.rating} / 5.0 (${venue.reviews} user reviews)`;

    // Open Modal
    this.dom.venueModal.classList.add('active');
  }

  /* ==========================================================================
     6. UI CONTROLS & EVENT BINDINGS
     ========================================================================== */

  bindUIEvents() {
    // District Selector Dropdown
    this.dom.districtSelect.addEventListener('change', (e) => {
      this.currentDistrictKey = e.target.value;
      const preset = DISTRICT_PRESETS[this.currentDistrictKey];
      if (preset) {
        this.flyToLocation(preset.center, preset.zoom, preset.pitch, preset.bearing);
        this.renderVenuesForCurrentDistrict();
      }
    });

    // Sidebar Collapse Toggle
    this.dom.sidebarCollapseBtn.addEventListener('click', () => {
      this.dom.sidebarPanel.classList.toggle('collapsed');
      this.dom.sidebarCollapseBtn.innerText = this.dom.sidebarPanel.classList.contains('collapsed') ? '▶' : '◀';
      setTimeout(() => this.map.resize(), 300);
    });

    // Search Input
    this.dom.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.dom.searchClearBtn.hidden = this.searchQuery.length === 0;
      this.renderVenuesForCurrentDistrict();
    });

    this.dom.searchClearBtn.addEventListener('click', () => {
      this.dom.searchInput.value = '';
      this.searchQuery = '';
      this.dom.searchClearBtn.hidden = true;
      this.renderVenuesForCurrentDistrict();
    });

    // Filter Chips Row
    this.dom.filterChipsContainer.addEventListener('click', (e) => {
      const target = e.target.closest('.chip-btn');
      if (!target) return;

      this.dom.filterChipsContainer.querySelectorAll('.chip-btn').forEach(btn => btn.classList.remove('active'));
      target.classList.add('active');

      this.activeCategory = target.dataset.category || 'ALL';
      this.renderVenuesForCurrentDistrict();
    });

    // Open Now Checkbox & Sort Dropdown
    this.dom.openNowCheckbox.addEventListener('change', (e) => {
      this.openNowOnly = e.target.checked;
      this.renderVenuesForCurrentDistrict();
    });

    this.dom.sortDropdown.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.renderVenuesForCurrentDistrict();
    });

    // Top Bar Control Buttons
    this.dom.btn3D.addEventListener('click', () => {
      this.is3DEnabled = !this.is3DEnabled;
      this.dom.btn3D.classList.toggle('active', this.is3DEnabled);
      this.map.easeTo({
        pitch: this.is3DEnabled ? 55 : 0,
        duration: 800
      });
    });

    this.dom.btnSatellite.addEventListener('click', () => {
      const isSatellite = this.currentTheme === 'satellite';
      this.currentTheme = isSatellite ? 'light' : 'satellite';
      this.map.setStyle(MAP_STYLES[this.currentTheme]);
      this.dom.btnSatellite.classList.toggle('active', !isSatellite);
    });

    this.dom.btnRecenter.addEventListener('click', () => {
      const preset = DISTRICT_PRESETS[this.currentDistrictKey];
      if (preset) {
        this.flyToLocation(preset.center, preset.zoom, preset.pitch, preset.bearing);
      }
    });

    this.dom.btnRadar.addEventListener('click', () => {
      this.showMapStatus('Scanning District POIs...');
      this.map.rotateTo(this.map.getBearing() + 90, { duration: 1500 });
      setTimeout(() => this.hideMapStatus(), 1600);
    });

    // Theme Switcher (Top Right)
    this.dom.themeToggleBtn.addEventListener('click', () => {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.map.setStyle(MAP_STYLES[this.currentTheme]);
    });

    // Modal Close Button & Backdrop
    this.dom.modalCloseBtn.addEventListener('click', () => {
      this.dom.venueModal.classList.remove('active');
    });

    this.dom.venueModal.addEventListener('click', (e) => {
      if (e.target === this.dom.venueModal) {
        this.dom.venueModal.classList.remove('active');
      }
    });

    // Directions Button Action
    this.dom.btnDirections.addEventListener('click', () => {
      if (this.activeVenue) {
        const [lng, lat] = this.activeVenue.coords;
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
      }
    });
  }

  /* ==========================================================================
     7. HELPER & TELEMETRY UTILITIES
     ========================================================================== */

  flyToLocation(center, zoom = 16.5, pitch = 45, bearing = 0) {
    this.map.flyTo({
      center: center,
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      speed: 1.2,
      curve: 1.4,
      essential: true
    });
  }

  updateTelemetryHUD() {
    if (!this.map) return;
    const center = this.map.getCenter();
    const zoom = this.map.getZoom().toFixed(1);
    const pitch = Math.round(this.map.getPitch());
    const bearing = Math.round(this.map.getBearing());

    // Update Coordinates Telemetry
    const latStr = `${Math.abs(center.lat).toFixed(4)}° ${center.lat >= 0 ? 'N' : 'S'}`;
    const lngStr = `${Math.abs(center.lng).toFixed(4)}° ${center.lng >= 0 ? 'E' : 'W'}`;
    this.dom.telemetryCoords.innerText = `${latStr}, ${lngStr}`;

    // Update Bottom Right HUD Cards
    this.dom.hudZoomVal.innerText = zoom;
    this.dom.hudPitchVal.innerText = `${bearing}° / ${pitch}°`;
  }

  showMapStatus(message) {
    this.dom.mapStatusPill.querySelector('span:last-child').innerText = message;
    this.dom.mapStatusPill.style.display = 'flex';
  }

  hideMapStatus() {
    this.dom.mapStatusPill.style.display = 'none';
  }
}

// Instantiate Engine when DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.cityGoApp = new CityGoEngine();
});
