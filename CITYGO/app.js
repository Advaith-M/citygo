/**
 * ==========================================================================
 * CITYGO VECTOR GIS EXPLORER — CORE ENGINE
 * File: js/app.js
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. REAL-TIME INTERACTIVE LEAFLET MAP ENGINE INITIALIZATION
     ------------------------------------------------------------------------ */
  const defaultCoords = [37.7749, -122.4194]; // Downtown Core vector center
  
  // Initialize Leaflet Map
  const map = L.map('map', {
    center: defaultCoords,
    zoom: 14,
    zoomControl: false
  });

  // Attach OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add Custom Zoom Control to top-right corner
  L.control.zoom({ position: 'topright' }).addTo(map);

  // Dynamic Layer Group for Vector Map Pins
  const markersGroup = L.layerGroup().addTo(map);

  /* ------------------------------------------------------------------------
     2. HIGH-TECH REAL-TIME DATASET (WITH REAL GPS COORDINATES)
     ------------------------------------------------------------------------ */
  const placesDatabase = [
    // --- FOOD & DRINKS ---
    { id: 'fd1', name: 'Apex Artisanal Roasters', category: 'Food & Drinks', rating: 4.9, reviews: 312, isOpen: true, address: '102 Market St', distance: '0.2 km', lat: 37.7755, lng: -122.4180 },
    { id: 'fd2', name: 'Lumina Sky Lounge', category: 'Food & Drinks', rating: 4.8, reviews: 245, isOpen: true, address: '88 Tower Way', distance: '0.4 km', lat: 37.7770, lng: -122.4160 },
    { id: 'fd3', name: 'Bistro De Express', category: 'Food & Drinks', rating: 4.7, reviews: 189, isOpen: true, address: '14 West Avenue', distance: '0.6 km', lat: 37.7730, lng: -122.4220 },
    { id: 'fd4', name: 'Urban Green Cafe', category: 'Food & Drinks', rating: 4.6, reviews: 142, isOpen: true, address: '305 Pine Road', distance: '0.8 km', lat: 37.7710, lng: -122.4150 },
    { id: 'fd5', name: 'Sushi Master Core', category: 'Food & Drinks', rating: 4.9, reviews: 520, isOpen: true, address: '12 Plaza Boulevard', distance: '1.1 km', lat: 37.7790, lng: -122.4210 },
    { id: 'fd6', name: 'Velvet Espresso Bar', category: 'Food & Drinks', rating: 4.5, reviews: 98, isOpen: true, address: '77 Commerce St', distance: '1.3 km', lat: 37.7705, lng: -122.4250 },
    { id: 'fd7', name: 'The Craft Brewery', category: 'Food & Drinks', rating: 4.8, reviews: 410, isOpen: true, address: '201 Dockside Lane', distance: '1.5 km', lat: 37.7810, lng: -122.4140 },
    { id: 'fd8', name: 'Late Night Diner', category: 'Food & Drinks', rating: 4.1, reviews: 65, isOpen: false, address: '900 Main St', distance: '2.0 km', lat: 37.7680, lng: -122.4300 },

    // --- HOTELS ---
    { id: 'h1', name: 'Grand Luxury Marquis', category: 'Hotels', rating: 5.0, reviews: 840, isOpen: true, address: '1 City Center Way', distance: '0.3 km', lat: 37.7760, lng: -122.4190 },
    { id: 'h2', name: 'The Skyline Suites', category: 'Hotels', rating: 4.8, reviews: 412, isOpen: true, address: '50 Highrise Blvd', distance: '0.7 km', lat: 37.7785, lng: -122.4170 },
    { id: 'h3', name: 'Aura Boutique Hotel', category: 'Hotels', rating: 4.7, reviews: 230, isOpen: true, address: '19 Park Lane', distance: '0.9 km', lat: 37.7725, lng: -122.4240 },
    { id: 'h4', name: 'Metro Executive Stays', category: 'Hotels', rating: 4.6, reviews: 175, isOpen: true, address: '88 Financial Square', distance: '1.2 km', lat: 37.7800, lng: -122.4130 },
    { id: 'h5', name: 'Urban Pod Retreat', category: 'Hotels', rating: 4.4, reviews: 310, isOpen: true, address: '404 Transit St', distance: '1.4 km', lat: 37.7695, lng: -122.4210 },
    { id: 'h6', name: 'Harbor View Lodge', category: 'Hotels', rating: 4.9, reviews: 620, isOpen: true, address: '12 Bay Promenade', distance: '1.8 km', lat: 37.7830, lng: -122.4110 },
    { id: 'h7', name: 'Crown Heights Resort', category: 'Hotels', rating: 4.8, reviews: 195, isOpen: true, address: '33 Vista Point', distance: '2.2 km', lat: 37.7850, lng: -122.4260 },

    // --- CITYSPOTS ---
    { id: 'cs1', name: 'Central Vector Park', category: 'CitySpots', rating: 4.9, reviews: 1250, isOpen: true, address: 'Downtown Green Belt', distance: '0.1 km', lat: 37.7745, lng: -122.4200 },
    { id: 'cs2', name: 'Metropolitan Observatory', category: 'CitySpots', rating: 4.8, reviews: 980, isOpen: true, address: 'Peak Summit Drive', distance: '0.5 km', lat: 37.7765, lng: -122.4230 },
    { id: 'cs3', name: 'Civic Art Plaza', category: 'CitySpots', rating: 4.7, reviews: 540, isOpen: true, address: '100 Heritage Square', distance: '0.8 km', lat: 37.7715, lng: -122.4180 },
    { id: 'cs4', name: 'Waterfront Promenade', category: 'CitySpots', rating: 4.9, reviews: 1100, isOpen: true, address: 'Pier 4 Vector Zone', distance: '1.0 km', lat: 37.7820, lng: -122.4150 },
    { id: 'cs5', name: 'Historical Clock Tower', category: 'CitySpots', rating: 4.5, reviews: 320, isOpen: true, address: 'Old Town Intersection', distance: '1.3 km', lat: 37.7700, lng: -122.4270 },
    { id: 'cs6', name: 'Botanical Glasshouse', category: 'CitySpots', rating: 4.8, reviews: 450, isOpen: true, address: '50 Ecology Drive', distance: '1.6 km', lat: 37.7685, lng: -122.4130 },
    { id: 'cs7', name: 'Riverfront Amphitheater', category: 'CitySpots', rating: 4.6, reviews: 290, isOpen: true, address: '77 River Way', distance: '2.1 km', lat: 37.7840, lng: -122.4200 },

    // --- SHOPS ---
    { id: 's1', name: 'Apex High-Tech Store', category: 'Shops', rating: 4.9, reviews: 670, isOpen: true, address: '44 Innovation St', distance: '0.2 km', lat: 37.7758, lng: -122.4185 },
    { id: 's2', name: 'Velvet Luxury Fashion', category: 'Shops', rating: 4.8, reviews: 310, isOpen: true, address: '12 Luxury Boulevard', distance: '0.4 km', lat: 37.7772, lng: -122.4175 },
    { id: 's3', name: 'Modern Design Goods', category: 'Shops', rating: 4.7, reviews: 190, isOpen: true, address: '89 Boutique Row', distance: '0.7 km', lat: 37.7735, lng: -122.4215 },
    { id: 's4', name: 'Urban Sneaker Vault', category: 'Shops', rating: 4.8, reviews: 820, isOpen: true, address: '202 Market St', distance: '0.9 km', lat: 37.7780, lng: -122.4145 },
    { id: 's5', name: 'Artisan Leather Co', category: 'Shops', rating: 4.6, reviews: 140, isOpen: true, address: '15 Heritage Lane', distance: '1.2 km', lat: 37.7712, lng: -122.4265 },
    { id: 's6', name: 'Chronos Timepieces', category: 'Shops', rating: 4.9, reviews: 260, isOpen: true, address: '300 Plaza Circle', distance: '1.5 km', lat: 37.7805, lng: -122.4225 },
    { id: 's7', name: 'Cyberpunk Collectibles', category: 'Shops', rating: 4.5, reviews: 390, isOpen: true, address: '88 Neon Way', distance: '1.9 km', lat: 37.7835, lng: -122.4285 },

    // --- FACILITY ---
    { id: 'f1', name: 'Metro Central Station', category: 'Facility', rating: 4.8, reviews: 2100, isOpen: true, address: 'Transit Hub Terminal 1', distance: '0.1 km', lat: 37.7740, lng: -122.4192 },
    { id: 'f2', name: 'City Hospital & ER', category: 'Facility', rating: 4.9, reviews: 1450, isOpen: true, address: '500 Health Parkway', distance: '0.5 km', lat: 37.7720, lng: -122.4210 },
    { id: 'f3', name: 'National Civic Library', category: 'Facility', rating: 4.8, reviews: 780, isOpen: true, address: '12 Knowledge Plaza', distance: '0.7 km', lat: 37.7762, lng: -122.4222 },
    { id: 'f4', name: 'Federal Reserve Bank', category: 'Facility', rating: 4.5, reviews: 210, isOpen: true, address: '1 Financial Way', distance: '1.0 km', lat: 37.7788, lng: -122.4158 },
    { id: 'f5', name: 'Vector EV Supercharge Station', category: 'Facility', rating: 4.9, reviews: 930, isOpen: true, address: 'Sector 4 Grid', distance: '1.2 km', lat: 37.7702, lng: -122.4165 },
    { id: 'f6', name: 'City Sports Complex', category: 'Facility', rating: 4.7, reviews: 610, isOpen: true, address: '88 Stadium Drive', distance: '1.6 km', lat: 37.7815, lng: -122.4245 },
    { id: 'f7', name: 'International Post Hub', category: 'Facility', rating: 4.3, reviews: 340, isOpen: true, address: '10 Logistics Road', distance: '2.0 km', lat: 37.7845, lng: -122.4125 },

    // --- MALLS ---
    { id: 'm1', name: 'The Pinnacle Galleria', category: 'Malls', rating: 4.9, reviews: 3400, isOpen: true, address: '100 Pinnacle Way', distance: '0.3 km', lat: 37.7768, lng: -122.4188 },
    { id: 'm2', name: 'Westside Metro Mall', category: 'Malls', rating: 4.7, reviews: 2100, isOpen: true, address: '45 West Avenue', distance: '0.8 km', lat: 37.7728, lng: -122.4238 },
    { id: 'm3', name: 'Avenue Center Plaza', category: 'Malls', rating: 4.6, reviews: 1800, isOpen: true, address: '88 Main Circle', distance: '1.1 km', lat: 37.7792, lng: -122.4162 },
    { id: 'm4', name: 'Plaza 360 Complex', category: 'Malls', rating: 4.8, reviews: 1250, isOpen: true, address: '360 Orbital Boulevard', distance: '1.4 km', lat: 37.7818, lng: -122.4218 },
    { id: 'm5', name: 'Harbor Gateway Mall', category: 'Malls', rating: 4.7, reviews: 990, isOpen: true, address: '1 Bayfront Drive', distance: '1.8 km', lat: 37.7838, lng: -122.4138 },
    { id: 'm6', name: 'Crown Heights Arcade', category: 'Malls', rating: 4.5, reviews: 740, isOpen: true, address: '77 Summit Road', distance: '2.1 km', lat: 37.7858, lng: -122.4278 },
    { id: 'm7', name: 'Vector Underground Mall', category: 'Malls', rating: 4.8, reviews: 1620, isOpen: true, address: 'Sub-Level Station 2', distance: '2.5 km', lat: 37.7690, lng: -122.4290 }
  ];

  /* ------------------------------------------------------------------------
     3. DOM ELEMENT REFERENCES
     ------------------------------------------------------------------------ */
  const sidebar = document.getElementById('appSidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const placesFeed = document.getElementById('placesFeed');
  const categoryGrid = document.getElementById('categoryGrid');
  const defaultCompartment = document.getElementById('defaultCompartment');
  const searchCompartmentHeader = document.getElementById('searchCompartmentHeader');
  const searchResultLabel = document.getElementById('searchResultLabel');
  const exitSearchBtn = document.getElementById('exitSearchBtn');
  const liveTimestamp = document.getElementById('liveTimestamp');
  const gpsTelemetry = document.getElementById('gpsTelemetry');
  const districtSelect = document.getElementById('districtSelect');

  // Quick matrix button IDs
  const utilityButtons = ['btnTicket', 'btnDirections', 'btnCall', 'btnAccount', 'btnSettings', 'btnCab'];

  let activeCategory = 'Food & Drinks';

  /* ------------------------------------------------------------------------
     4. RENDER HELPERS (STAR RATINGS, STATUS DOTS, CARD MARKUP)
     ------------------------------------------------------------------------ */
  function renderStarRating(rating) {
    const fullStars = Math.floor(rating);
    let starsHtml = '';
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHtml += `<span class="star-icon">★</span>`;
      } else {
        starsHtml += `<span class="star-icon dim">★</span>`;
      }
    }
    return starsHtml;
  }

  function renderPlaceCard(place) {
    const statusClass = place.isOpen ? 'dot-open' : 'dot-closed';

    return `
      <div class="place-card" data-id="${place.id}" data-lat="${place.lat}" data-lng="${place.lng}">
        <span class="live-status-dot ${statusClass}" title="${place.isOpen ? 'Live Open' : 'Currently Closed'}"></span>
        <div class="card-main-content">
          <div class="card-title-row">
            <h4 class="card-place-name">${place.name}</h4>
            <span class="card-place-category">${place.category}</span>
          </div>
          <div class="star-rating-row">
            <div class="stars-wrapper">${renderStarRating(place.rating)}</div>
            <span class="rating-score-text">${place.rating.toFixed(1)}</span>
            <span class="user-reviews-count">(${place.reviews})</span>
          </div>
          <div class="card-subtitle">${place.address} • <strong>${place.distance}</strong></div>
        </div>
      </div>
    `;
  }

  /* ------------------------------------------------------------------------
     5. MAP MARKER DYNAMIC SYNC LOGIC
     ------------------------------------------------------------------------ */
  function updateMapMarkers(places) {
    markersGroup.clearLayers();
    const bounds = [];

    places.forEach(place => {
      if (place.lat && place.lng) {
        // Create Leaflet Vector Marker
        const marker = L.marker([place.lat, place.lng]);

        // Popup Content
        const popupContent = `
          <div style="font-family:'Plus Jakarta Sans',sans-serif; padding:2px;">
            <strong style="font-size:13px; color:#0f172a; display:block; margin-bottom:2px;">${place.name}</strong>
            <span style="font-size:10px; color:#2563eb; font-weight:700; background:#eff6ff; padding:2px 5px; border-radius:4px;">${place.category}</span>
            <span style="font-size:11px; color:#f59e0b; font-weight:700; margin-left:4px;">★ ${place.rating.toFixed(1)}</span>
            <div style="font-size:10px; color:#64748b; margin-top:4px;">${place.address}</div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersGroup.addLayer(marker);
        bounds.push([place.lat, place.lng]);
      }
    });

    // Auto-fit map viewport to active markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }

  /* ------------------------------------------------------------------------
     6. FEED DISPLAY LOGIC (STRICT TOP 7 LIMIT, LIVE & OPEN PRIORITY)
     ------------------------------------------------------------------------ */
  function updateFeedForCategory(categoryName) {
    activeCategory = categoryName;

    // Filter places by category and prioritize OPEN spots (STRICT TOP 7 LIMIT)
    const categoryPlaces = placesDatabase
      .filter(p => p.category === categoryName && p.isOpen)
      .slice(0, 7);

    placesFeed.innerHTML = categoryPlaces.map(p => renderPlaceCard(p)).join('');
    updateMapMarkers(categoryPlaces);
  }

  function updateFeedForSearch(query) {
    let searchResults = [];

    if (!query || query.trim() === '') {
      // Empty input state -> Show Top 7 overall recommended open places
      searchResults = placesDatabase.filter(p => p.isOpen).slice(0, 7);
      searchResultLabel.textContent = "TOP 7 RECOMMENDED (LIVE FOCUS)";
    } else {
      // Text typed state -> Filter places matching prompt text (STRICT TOP 7 LIMIT)
      const cleanQuery = query.toLowerCase().trim();
      searchResults = placesDatabase.filter(p => 
        p.name.toLowerCase().includes(cleanQuery) || 
        p.category.toLowerCase().includes(cleanQuery) ||
        p.address.toLowerCase().includes(cleanQuery)
      ).slice(0, 7);

      searchResultLabel.textContent = `SEARCH RESULTS FOR "${query.toUpperCase()}" (${searchResults.length})`;
    }

    placesFeed.innerHTML = searchResults.length > 0 
      ? searchResults.map(p => renderPlaceCard(p)).join('')
      : `<div style="padding:20px; text-align:center; font-size:12px; color:#64748b;">No matching spots found. Try searching for "Cafe", "Mall", or "Park".</div>`;

    updateMapMarkers(searchResults);
  }

  /* ------------------------------------------------------------------------
     7. SEARCH EVENT HANDLERS & VIEW MODE SWITCHING
     ------------------------------------------------------------------------ */
  function enterSearchView() {
    defaultCompartment.style.display = 'none';
    searchCompartmentHeader.style.display = 'flex';
    searchClearBtn.style.display = 'block';
    updateFeedForSearch(searchInput.value);
  }

  function exitSearchView() {
    searchInput.value = '';
    searchClearBtn.style.display = 'none';
    defaultCompartment.style.display = 'block';
    searchCompartmentHeader.style.display = 'none';
    updateFeedForCategory(activeCategory);
  }

  searchInput.addEventListener('focus', () => {
    enterSearchView();
  });

  searchInput.addEventListener('input', (e) => {
    updateFeedForSearch(e.target.value);
  });

  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    updateFeedForSearch('');
    searchInput.focus();
  });

  exitSearchBtn.addEventListener('click', () => {
    exitSearchView();
  });

  /* ------------------------------------------------------------------------
     8. CATEGORY SELECTION HANDLERS
     ------------------------------------------------------------------------ */
  categoryGrid.addEventListener('click', (e) => {
    const catBtn = e.target.closest('.category-card-btn');
    if (!catBtn) return;

    document.querySelectorAll('.category-card-btn').forEach(b => b.classList.remove('active'));
    catBtn.classList.add('active');

    const selectedCat = catBtn.getAttribute('data-category');
    updateFeedForCategory(selectedCat);
  });

  /* ------------------------------------------------------------------------
     9. SIDEBAR CARD CLICK -> INTERACTIVE MAP PAN & POPUP
     ------------------------------------------------------------------------ */
  placesFeed.addEventListener('click', (e) => {
    const card = e.target.closest('.place-card');
    if (!card) return;

    const lat = parseFloat(card.getAttribute('data-lat'));
    const lng = parseFloat(card.getAttribute('data-lng'));
    const placeId = card.getAttribute('data-id');

    if (lat && lng) {
      // Fly map smoothly to selected location
      map.flyTo([lat, lng], 16, { animate: true, duration: 1.2 });

      // Update telemetry display
      gpsTelemetry.textContent = `${lat.toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° W`;

      // Open corresponding popup marker on map
      markersGroup.eachLayer(layer => {
        if (layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) {
          layer.openPopup();
        }
      });
    }
  });

  /* ------------------------------------------------------------------------
     10. TOP-LEFT SIDEBAR COLLAPSE MECHANIC
     ------------------------------------------------------------------------ */
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    sidebarToggle.textContent = sidebar.classList.contains('collapsed') ? '▶' : '◀';
    
    // Invalidate map size so Leaflet recalculates viewport width smoothly
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  });

  /* ------------------------------------------------------------------------
     11. QUICK UTILITY MATRIX ACTIONS BINDING
     ------------------------------------------------------------------------ */
  utilityButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        const actionName = btnId.replace('btn', '');
        alert(`CITYGO GIS: ${actionName.toUpperCase()} service requested for active vector focus.`);
      });
    }
  });

  /* ------------------------------------------------------------------------
     12. DISTRICT SELECTOR HANDLER
     ------------------------------------------------------------------------ */
  districtSelect.addEventListener('change', (e) => {
    const district = e.target.value;
    alert(`CITYGO GIS: Telemetry filter set to ${district.toUpperCase()} District.`);
  });

  /* ------------------------------------------------------------------------
     13. INITIALIZATION & LIVE CLOCK
     ------------------------------------------------------------------------ */
  function updateLiveClock() {
    const now = new Date();
    liveTimestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // Initial feed & map markers load for default category "Food & Drinks"
  updateFeedForCategory('Food & Drinks');
});
