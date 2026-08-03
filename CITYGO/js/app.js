/* ==========================================================================
   CITYGO VECTOR GIS EXPLORER — CORE CONTROLLER & MAP ENGINE
   File: js/app.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. APPLICATION STATE & LOCAL DATASET
  // ------------------------------------------------------------------------
  const state = {
    isSidebarCollapsed: false,
    activeCategory: 'all',
    searchQuery: '',
    currentDistrict: 'all',
    places: [
      {
        id: 1,
        name: 'Aura Luxury Lounge',
        category: 'nightlife',
        district: 'downtown',
        rating: 4.9,
        reviews: 128,
        isOpen: true,
        address: '450 Grand Ave',
        lat: 37.7749,
        lng: -122.4194
      },
      {
        id: 2,
        name: 'Omni Vector Bistro',
        category: 'dining',
        district: 'downtown',
        rating: 4.7,
        reviews: 94,
        isOpen: true,
        address: '102 Market St',
        lat: 37.7785,
        lng: -122.4150
      },
      {
        id: 3,
        name: 'Apex Fitness Club',
        category: 'health',
        district: 'marina',
        rating: 4.8,
        reviews: 210,
        isOpen: false,
        address: '88 Waterfront Rd',
        lat: 37.7810,
        lng: -122.4230
      },
      {
        id: 4,
        name: 'Kuro Artisan Coffee',
        category: 'cafes',
        district: 'downtown',
        rating: 4.9,
        reviews: 340,
        isOpen: true,
        address: '15 Mission St',
        lat: 37.7720,
        lng: -122.4120
      },
      {
        id: 5,
        name: 'Velox Tech Hub',
        category: 'services',
        district: 'soho',
        rating: 4.6,
        reviews: 52,
        isOpen: true,
        address: '500 Tech Blvd',
        lat: 37.7690,
        lng: -122.4280
      }
    ]
  };

  // Safe DOM Element Selections
  const sidebar = document.querySelector('.compact-sidebar');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const districtSelect = document.getElementById('districtSelect');
  const categoryBtns = document.querySelectorAll('.category-card-btn');
  const cardsContainer = document.getElementById('shopCardsList');
  const visibleCountEl = document.getElementById('visibleCount');
  const matrixBtns = document.querySelectorAll('.matrix-btn');

  let map = null;
  let mapMarkers = [];

  // ------------------------------------------------------------------------
  // 2. ZERO-ERROR MAP INITIALIZATION
  // ------------------------------------------------------------------------
  function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    try {
      // MapLibre GL JS Vector Engine
      if (typeof maplibregl !== 'undefined') {
        map = new maplibregl.Map({
          container: 'map',
          center: [-122.4194, 37.7749],
          zoom: 13,
          /* 
           * Passing the canonical pre-built style URL eliminates all 
           * layer mismatches (water, roads, buildings, labels, etc.)
           */
          style: 'https://demotiles.maplibre.org/style.json'
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');
      } 
      // Secondary Fallback: Leaflet.js
      else if (typeof L !== 'undefined') {
        map = L.map('map', { zoomControl: false }).setView([37.7749, -122.4194], 14);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap &copy; CARTO'
        }).addTo(map);

        L.control.zoom({ position: 'topright' }).addTo(map);
      }
    } catch (err) {
      console.warn('Map initialization operating in fallback mode:', err);
    }

    // Safely render markers only after style initialization
    if (map) {
      if (typeof maplibregl !== 'undefined' && map instanceof maplibregl.Map) {
        map.on('load', () => {
          renderMapMarkers();
        });
      } else {
        renderMapMarkers();
      }
    }
  }

  // ------------------------------------------------------------------------
  // 3. MAP MARKERS RENDERER (HUD RADAR PINS)
  // ------------------------------------------------------------------------
  function renderMapMarkers() {
    if (!map) return;
    const filtered = getFilteredPlaces();

    // Clear existing markers cleanly
    mapMarkers.forEach(marker => {
      if (marker && typeof marker.remove === 'function') {
        marker.remove();
      }
    });
    mapMarkers = [];

    filtered.forEach(place => {
      if (typeof maplibregl !== 'undefined' && map instanceof maplibregl.Map) {
        const el = document.createElement('div');
        el.className = 'custom-hud-marker';
        el.innerHTML = `
          <div class="hud-pin-wrapper">
            <div class="hud-pin-pulse"></div>
            <div class="hud-pin-core"></div>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 12 }).setHTML(`
          <div style="padding: 4px; font-family: sans-serif;">
            <strong style="font-size: 12px; color: #0f172a;">${place.name}</strong><br/>
            <span style="font-size: 10px; color: #64748b;">${place.address}</span>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([place.lng, place.lat])
          .setPopup(popup)
          .addTo(map);

        mapMarkers.push(marker);
      } 
      else if (typeof L !== 'undefined') {
        const hudIcon = L.divIcon({
          className: 'custom-hud-marker',
          html: `
            <div class="hud-pin-wrapper">
              <div class="hud-pin-pulse"></div>
              <div class="hud-pin-core"></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([place.lat, place.lng], { icon: hudIcon })
          .bindPopup(`<strong>${place.name}</strong><br/>${place.address}`)
          .addTo(map);

        mapMarkers.push(marker);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 4. FILTERING ENGINE
  // ------------------------------------------------------------------------
  function getFilteredPlaces() {
    return state.places.filter(place => {
      const matchesCategory = state.activeCategory === 'all' || place.category === state.activeCategory;
      const matchesQuery = place.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                           place.category.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                           place.address.toLowerCase().includes(state.searchQuery.toLowerCase());
      const matchesDistrict = state.currentDistrict === 'all' || place.district === state.currentDistrict;

      return matchesCategory && matchesQuery && matchesDistrict;
    });
  }

  // ------------------------------------------------------------------------
  // 5. SIDEBAR UI RENDERER
  // ------------------------------------------------------------------------
  function buildStarRatingHTML(rating, reviews) {
    const fullStars = Math.floor(rating);
    let starsHtml = '';

    for (let i = 1; i <= 5; i++) {
      starsHtml += `<span class="star-icon ${i <= fullStars ? '' : 'dim'}">★</span>`;
    }

    return `
      <div class="star-rating-row">
        <div class="stars-wrapper">${starsHtml}</div>
        <span class="rating-score-text">${rating.toFixed(1)}</span>
        <span class="user-reviews-count">(${reviews})</span>
      </div>
    `;
  }

  function renderPlacesList() {
    const places = getFilteredPlaces();
    if (visibleCountEl) visibleCountEl.textContent = places.length;

    if (!cardsContainer) return;

    if (places.length === 0) {
      cardsContainer.innerHTML = `
        <div style="padding: 24px 12px; text-align: center; color: #64748b; font-size: 11px; font-weight: 600;">
          No points of interest match criteria.
        </div>
      `;
      return;
    }

    cardsContainer.innerHTML = places.map(place => `
      <div class="place-card" data-id="${place.id}">
        <div class="live-status-dot ${place.isOpen ? 'dot-open' : 'dot-closed'}" title="${place.isOpen ? 'Open' : 'Closed'}"></div>
        <div class="card-main-content">
          <div class="card-title-row">
            <span class="card-place-name">${place.name}</span>
            <span class="card-place-category">${place.category}</span>
          </div>
          ${buildStarRatingHTML(place.rating, place.reviews)}
          <div class="card-subtitle">${place.address}</div>
        </div>
      </div>
    `).join('');

    // Attach card click handlers
    document.querySelectorAll('.place-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.getAttribute('data-id'), 10);
        const place = state.places.find(p => p.id === id);
        
        if (place && map) {
          if (typeof maplibregl !== 'undefined' && map.flyTo) {
            map.flyTo({ center: [place.lng, place.lat], zoom: 15.5, speed: 1.2 });
          } else if (typeof map.setView === 'function') {
            map.setView([place.lat, place.lng], 15);
          }
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 6. EVENT LISTENERS
  // ------------------------------------------------------------------------
  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
      sidebar.classList.toggle('collapsed', state.isSidebarCollapsed);
      sidebarToggleBtn.textContent = state.isSidebarCollapsed ? '▶' : '◀';

      setTimeout(() => {
        if (map && typeof map.resize === 'function') map.resize();
        if (map && typeof map.invalidateSize === 'function') map.invalidateSize();
      }, 310);
    });
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.getAttribute('data-category') || 'all';

      renderPlacesList();
      renderMapMarkers();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderPlacesList();
      renderMapMarkers();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      state.searchQuery = '';
      renderPlacesList();
      renderMapMarkers();
    });
  }

  if (districtSelect) {
    districtSelect.addEventListener('change', (e) => {
      state.currentDistrict = e.target.value;
      renderPlacesList();
      renderMapMarkers();
    });
  }

  matrixBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-action');
      if (type === 'reset') {
        state.activeCategory = 'all';
        state.searchQuery = '';
        state.currentDistrict = 'all';
        if (searchInput) searchInput.value = '';
        if (districtSelect) districtSelect.value = 'all';
        categoryBtns.forEach(b => b.classList.remove('active'));
        if (categoryBtns[0]) categoryBtns[0].classList.add('active');
        renderPlacesList();
        renderMapMarkers();
      }
    });
  });

  // ------------------------------------------------------------------------
  // 7. INITIAL EXECUTION
  // ------------------------------------------------------------------------
  initMap();
  renderPlacesList();
});
