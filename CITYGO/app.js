/**
 * CityGO - Main Application Controller (app.js)
 * Initializes modules, binds global state, and connects user search input.
 */

window.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Map Canvas Engine
    if (typeof MapEngine !== "undefined") {
        MapEngine.init();
    }

    // 2. Load Master Shops Dataset
    const initialShops = typeof ShopsEngine !== "undefined" ? ShopsEngine.getAllShops() : [];

    // 3. Render Initial Sidebar Cards & Map Pins
    if (typeof UI !== "undefined") {
        UI.renderShopList(initialShops);
    }

    if (typeof MapEngine !== "undefined") {
        MapEngine.setShops(initialShops);
        // Default User Location (Los Angeles / City Center)
        MapEngine.setUserLocation(34.0522, -118.2437, "My Location");
    }

    // 4. Bind Search Input Bar (if present in HTML)
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value;
            const filtered = ShopsEngine.filterShops(query);
            
            UI.renderShopList(filtered);
            MapEngine.setShops(filtered);
        });
    }
});