/**
 * ==========================================================================
 * CITYGO VECTOR GIS EXPLORER — CORE ENGINE (js/app.js)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  
  /* ------------------------------------------------------------------------
     1. HIGH-TECH REAL-TIME DATA DATASET (CATEGORIZED & VERIFIED)
     ------------------------------------------------------------------------ */
  const placesDatabase = [
    // --- FOOD & DRINKS ---
    { id: 'fd1', name: 'Apex Artisanal Roasters', category: 'Food & Drinks', rating: 4.9, reviews: 312, isOpen: true, address: '102 Market St', distance: '0.2 km' },
    { id: 'fd2', name: 'Lumina Sky Lounge', category: 'Food & Drinks', rating: 4.8, reviews: 245, isOpen: true, address: '88 Tower Way', distance: '0.4 km' },
    { id: 'fd3', name: 'Bistro De Express', category: 'Food & Drinks', rating: 4.7, reviews: 189, isOpen: true, address: '14 West Avenue', distance: '0.6 km' },
    { id: 'fd4', name: 'Urban Green Cafe', category: 'Food & Drinks', rating: 4.6, reviews: 142, isOpen: true, address: '305 Pine Road', distance: '0.8 km' },
    { id: 'fd5', name: 'Sushi Master Core', category: 'Food & Drinks', rating: 4.9, reviews: 520, isOpen: true, address: '12 Plaza Boulevard', distance: '1.1 km' },
    { id: 'fd6', name: 'Velvet Espresso Bar', category: 'Food & Drinks', rating: 4.5, reviews: 98, isOpen: true, address: '77 Commerce St', distance: '1.3 km' },
    { id: 'fd7', name: 'The Craft Brewery', category: 'Food & Drinks', rating: 4.8, reviews: 410, isOpen: true, address: '201 Dockside Lane', distance: '1.5 km' },
    { id: 'fd8', name: 'Late Night Diner', category: 'Food & Drinks', rating: 4.1, reviews: 65, isOpen: false, address: '900 Main St', distance: '2.0 km' },

    // --- HOTELS ---
    { id: 'h1', name: 'Grand Luxury Marquis', category: 'Hotels', rating: 5.0, reviews: 840, isOpen: true, address: '1 City Center Way', distance: '0.3 km' },
    { id: 'h2', name: 'The Skyline Suites', category: 'Hotels', rating: 4.8, reviews: 412, isOpen: true, address: '50 Highrise Blvd', distance: '0.7 km' },
    { id: 'h3', name: 'Aura Boutique Hotel', category: 'Hotels', rating: 4.7, reviews: 230, isOpen: true, address: '19 Park Lane', distance: '0.9 km' },
    { id: 'h4', name: 'Metro Executive Stays', category: 'Hotels', rating: 4.6, reviews: 175, isOpen: true, address: '88 Financial Square', distance: '1.2 km' },
    { id: 'h5', name: 'Urban Pod Retreat', category: 'Hotels', rating: 4.4, reviews: 310, isOpen: true, address: '404 Transit St', distance: '1.4 km' },
    { id: 'h6', name: 'Harbor View Lodge', category: 'Hotels', rating: 4.9, reviews: 620, isOpen: true, address: '12 Bay Promenade', distance: '1.8 km' },
    { id: 'h7', name: 'Crown Heights Resort', category: 'Hotels', rating: 4.8, reviews: 195, isOpen: true, address: '33 Vista Point', distance: '2.2 km' },

    // --- CITYSPOTS ---
    { id: 'cs1', name: 'Central Vector Park', category: 'CitySpots', rating: 4.9, reviews: 1250, isOpen: true, address: 'Downtown Green Belt', distance: '0.1 km' },
    { id: 'cs2', name: 'Metropolitan Observatory', category: 'CitySpots', rating: 4.8, reviews: 980, isOpen: true, address: 'Peak Summit Drive', distance: '0.5 km' },
    { id: 'cs3', name: 'Civic Art Plaza', category: 'CitySpots', rating: 4.7, reviews: 540, isOpen: true, address: '100 Heritage Square', distance: '0.8 km' },
    { id: 'cs4', name: ' waterfront Promenade', category: 'CitySpots', rating: 4.9, reviews: 1100, isOpen: true, address: 'Pier 4 Vector Zone', distance: '1.0 km' },
    { id: 'cs5', name: 'Historical Clock Tower', category: 'CitySpots', rating: 4.5, reviews: 320, isOpen: true, address: 'Old Town Intersection', distance: '1.3 km' },
    { id: 'cs6', name: 'Botanical Glasshouse', category: 'CitySpots', rating: 4.8, reviews: 450, isOpen: true, address: '50 Ecology Drive', distance: '1.6 km' },
    { id: 'cs7', name: 'Riverfront Amphitheater', category: 'CitySpots', rating: 4.6, reviews: 290, isOpen: true, address: '77 River Way', distance: '2.1 km' },

    // --- SHOPS ---
    { id: 's1', name: 'Apex High-Tech Store', category: 'Shops', rating: 4.9, reviews: 670, isOpen: true, address: '44 Innovation St', distance: '0.2 km' },
    { id: 's2', name: 'Velvet Luxury Fashion', category: 'Shops', rating: 4.8, reviews: 310, isOpen: true, address: '12 Luxury Boulevard', distance: '0.4 km' },
    { id: 's3', name: 'Modern Design Goods', category: 'Shops', rating: 4.7, reviews: 190, isOpen: true, address: '89 Boutique Row', distance: '0.7 km' },
    { id: 's4', name: 'Urban Sneaker Vault', category: 'Shops', rating: 4.8, reviews: 820, isOpen: true, address: '202 Market St', distance: '0.9 km' },
    { id: 's5', name: 'Artisan Leather Co', category: 'Shops', rating: 4.6, reviews: 140, isOpen: true, address: '15 Heritage Lane', distance: '1.2 km' },
    { id: 's6', name: 'Chronos Timepieces', category: 'Shops', rating: 4.9, reviews: 260, isOpen: true, address: '300 Plaza Circle', distance: '1.5 km' },
    { id: 's7', name: 'Cyberpunk Collectibles', category: 'Shops', rating: 4.5, reviews: 390, isOpen: true, address: '88 Neon Way', distance: '1.9 km' },

    // --- FACILITY ---
    { id: 'f1', name: 'Metro Central Station', category: 'Facility', rating: 4.8, reviews: 2100, isOpen: true, address: 'Transit Hub Terminal 1', distance: '0.1 km' },
    { id: 'f2', name: 'City Hospital & ER', category: 'Facility', rating: 4.9, reviews: 1450, isOpen: true, address: '500 Health Parkway', distance: '0.5 km' },
    { id: 'f3', name: 'National Civic Library', category: 'Facility', rating: 4.8, reviews: 780, isOpen: true, address: '12 Knowledge Plaza', distance: '0.7 km' },
    { id: 'f4', name: 'Federal Reserve Bank', category: 'Facility', rating: 4.5, reviews: 210, isOpen: true, address: '1 Financial Way', distance: '1.0 km' },
    { id: 'f5', name: 'Vector EV Supercharge Station', category: 'Facility', rating: 4.9, reviews: 930, isOpen: true, address: 'Sector 4 Grid', distance: '1.2 km' },
    { id: 'f6', name: 'City Sports Complex', category: 'Facility', rating: 4.7, reviews: 610, isOpen: true, address: '88 Stadium Drive', distance: '1.6 km' },
    { id: 'f7', name: 'International Post Hub', category: 'Facility', rating: 4.3, reviews: 340, isOpen: true, address: '10 Logistics Road', distance: '2.0 km' },

    // --- MALLS ---
    { id: 'm1', name: 'The Pinnacle Galleria', category: 'Malls', rating: 4.9, reviews: 3400, isOpen: true, address: '100 Pinnacle Way', distance: '0.3 km' },
    { id: 'm2', name: 'Westside Metro Mall', category: 'Malls', rating: 4.7, reviews: 2100, isOpen: true, address: '45 West Avenue', distance: '0.8 km' },
    { id: 'm3', name: 'Avenue Center Plaza', category: 'Malls', rating: 4.6, reviews: 1800, isOpen: true, address: '88 Main Circle', distance: '1.1 km' },
    { id: 'm4', name: 'Plaza 360 Complex', category: 'Malls', rating: 4.8, reviews: 1250, isOpen: true, address: '360 Orbital Boulevard', distance: '1.4 km' },
    { id: 'm5', name: 'Harbor Gateway Mall', category: 'Malls', rating: 4.7, reviews: 990, isOpen: true, address: '1 Bayfront Drive', distance: '1.8 km' },
    { id: 'm6', name: 'Crown Heights Arcade', category: 'Malls', rating: 4.5, reviews: 740, isOpen: true, address: '77 Summit Road', distance: '2.1 km' },
    { id: 'm7', name: 'Vector Underground Mall', category: 'Malls', rating: 4.8, reviews: 1620, isOpen: true, address: 'Sub-Level Station 2', distance: '2.5 km' }
  ];

  /* ------------------------------------------------------------------------
     2. DOM ELEMENT REFERENCES
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

  // Quick matrix button actions
  const utilityButtons = ['btnTicket', 'btnDirections', 'btnCall', 'btnAccount', 'btnSettings', 'btnCab'];

  let activeCategory = 'Food & Drinks';

  /* ------------------------------------------------------------------------
     3. UTILITY RENDER HELPERS (STAR RATINGS & GREEN/GRAY STATUS DOTS)
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
    // Green dot if open, Gray dot if closed
    const statusClass = place.isOpen ? 'dot-open' : 'dot-closed';

    return `
      <div class="place-card" data-id="${place.id}">
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
     4. FEED DISPLAY LOGIC (STRICT TOP 7 LIMIT, LIVE & OPEN PRIORITY)
     ------------------------------------------------------------------------ */
  function updateFeedForCategory(categoryName) {
    activeCategory = categoryName;

    // Filter places by category and prioritize OPEN spots
    const categoryPlaces = placesDatabase
      .filter(p => p.category === categoryName && p.isOpen)
      .slice(0, 7); // STRICT TOP 7 LIMIT

    placesFeed.innerHTML = categoryPlaces.map(p => renderPlaceCard(p)).join('');
  }

  function updateFeedForSearch(query) {
    let searchResults = [];

    if (!query || query.trim() === '') {
      // If typing focus active but text is empty -> Show Top 7 overall recommended open places
      searchResults = placesDatabase.filter(p => p.isOpen).slice(0, 7);
      searchResultLabel.textContent = "TOP 7 RECOMMENDED (LIVE FOCUS)";
    } else {
      // Filter places matching prompt text
      const cleanQuery = query.toLowerCase().trim();
      searchResults = placesDatabase.filter(p => 
        p.name.toLowerCase().includes(cleanQuery) || 
        p.category.toLowerCase().includes(cleanQuery) ||
        p.address.toLowerCase().includes(cleanQuery)
      ).slice(0, 7); // STRICT TOP 7 MATCHES

      searchResultLabel.textContent = `SEARCH RESULTS FOR "${query.toUpperCase()}" (${searchResults.length})`;
    }

    placesFeed.innerHTML = searchResults.length > 0 
      ? searchResults.map(p => renderPlaceCard(p)).join('')
      : `<div style="padding:20px; text-align:center; font-size:12px; color:#64748b;">No matching spots found. Try searching for "Cafe", "Mall", or "Park".</div>`;
  }

  /* ------------------------------------------------------------------------
     5. SEARCH EVENT HANDLERS & VIEW MODE SWITCHING
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
     6. CATEGORY SELECTION HANDLERS
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
     7. TOP LEFT SIDEBAR COLLAPSE / CLOSE MECHANIC
     ------------------------------------------------------------------------ */
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    sidebarToggle.textContent = sidebar.classList.contains('collapsed') ? '▶' : '◀';
  });

  /* ------------------------------------------------------------------------
     8. QUICK UTILITY MATRIX ACTIONS BINDING
     ------------------------------------------------------------------------ */
  utilityButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        const actionName = btnId.replace('btn', '');
        alert(`CITYGO GIS: ${actionName.toUpperCase()} interface requested for highlighted location.`);
      });
    }
  });

  /* ------------------------------------------------------------------------
     9. INITIALIZATION & LIVE CLOCK
     ------------------------------------------------------------------------ */
  function updateLiveClock() {
    const now = new Date();
    liveTimestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // Initial feed population with Food & Drinks top 7 spots
  updateFeedForCategory('Food & Drinks');
});
