/**
 * CityGO - Map Engine Module (map.js)
 * High-performance vector canvas map renderer with smooth interaction.
 */

const MapEngine = (function () {
    // Canvas & Context references
    let canvas = null;
    let ctx = null;

    // Viewport State
    let zoomScale = 1800; // Initial neighborhood level
    let centerLat = 34.0522; // Default starting latitude (Los Angeles)
    let centerLon = -118.2437; // Default starting longitude

    // Interaction State
    let isDragging = false;
    let dragStartMouse = { x: 0, y: 0 };
    let dragStartCenter = { lat: 0, lon: 0 };
    let hoveredShopId = null;

    // Active Dataset
    let currentShops = [];
    let activeUserLocation = { lat: 34.0522, lon: -118.2437, address: "Home" };

    /**
     * Initializes the canvas element, event listeners, and initial render loop.
     */
    function init() {
        canvas = document.getElementById("mapCanvas");
        if (!canvas) {
            console.error("Map Canvas element (#mapCanvas) not found.");
            return;
        }

        ctx = canvas.getContext("2d");
        resizeCanvas();

        // Attach Event Listeners
        window.addEventListener("resize", onResize);
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("wheel", onWheel, { passive: false });
        canvas.addEventListener("click", onClick);

        // Initial Draw
        draw();
    }

    /**
     * Updates canvas dimensions to fill its container parent.
     */
    function resizeCanvas() {
        if (!canvas || !canvas.parentElement) return;
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }

    function onResize() {
        resizeCanvas();
        draw();
    }

    /**
     * Converts Geo Coordinates (Lat/Lon) to Screen Pixels based on current viewport.
     */
    function latLonToPixel(lat, lon) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        return {
            x: centerX + (lon - centerLon) * (canvas.width / 360) * zoomScale,
            y: centerY - (lat - centerLat) * (canvas.height / 180) * zoomScale
        };
    }

    /**
     * Mouse Panning Controls
     */
    function onMouseDown(e) {
        isDragging = true;
        dragStartMouse = { x: e.clientX, y: e.clientY };
        dragStartCenter = { lat: centerLat, lon: centerLon };
        canvas.style.cursor = "grabbing";
    }

    function onMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (isDragging) {
            const dx = e.clientX - dragStartMouse.x;
            const dy = e.clientY - dragStartMouse.y;

            centerLon = dragStartCenter.lon - (dx / (canvas.width * 0.0025 * zoomScale));
            centerLat = dragStartCenter.lat + (dy / (canvas.height * 0.0025 * zoomScale));
            draw();
            return;
        }

        // Check for marker hover states
        let foundHover = false;
        for (const shop of currentShops) {
            const pos = latLonToPixel(shop.coordinates.lat, shop.coordinates.lng);
            const dist = Math.hypot(mouseX - pos.x, mouseY - pos.y);
            if (dist <= 12) {
                hoveredShopId = shop.id;
                foundHover = true;
                canvas.style.cursor = "pointer";
                break;
            }
        }

        if (!foundHover) {
            hoveredShopId = null;
            canvas.style.cursor = "grab";
        }

        draw();
    }

    function onMouseUp() {
        isDragging = false;
        canvas.style.cursor = "grab";
    }

    /**
     * Mouse Wheel Zooming
     */
    function onWheel(e) {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.2 : 0.83;
        zoom(zoomFactor);
    }

    function zoom(factor) {
        zoomScale = Math.min(Math.max(1, zoomScale * factor), 5000);
        updateZoomBadge();
        draw();
    }

    function setZoomTier(targetScale) {
        zoomScale = targetScale;
        updateZoomBadge();
        draw();
    }

    function updateZoomBadge() {
        const badge = document.getElementById("mapLevelBadge");
        if (!badge) return;

        if (zoomScale < 10) {
            badge.innerText = "Level: Global View 🌍";
        } else if (zoomScale < 100) {
            badge.innerText = "Level: Country View 🏳️";
        } else if (zoomScale < 600) {
            badge.innerText = "Level: City District 🏙️";
        } else {
            badge.innerText = "Level: Local Streets 📍";
        }
    }

    /**
     * Marker Click Handler
     */
    function onClick(e) {
        if (hoveredShopId && typeof UI !== "undefined" && UI.openShopDetails) {
            UI.openShopDetails(hoveredShopId);
        }
    }

    /**
     * Data Binding
     */
    function setShops(shopsData) {
        currentShops = shopsData || [];
        draw();
    }

    function setUserLocation(lat, lon, address) {
        activeUserLocation = { lat, lon, address };
        centerLat = lat;
        centerLon = lon;
        draw();
    }

    function centerOn(lat, lon, targetZoom = 1800) {
        centerLat = lat;
        centerLon = lon;
        zoomScale = targetZoom;
        updateZoomBadge();
        draw();
    }

    /**
     * Core Render Loop
     */
    function draw() {
        if (!ctx) return;

        // 1. Draw Canvas Background (Dark Vector Style)
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw Grid/Road Framework (Visible at higher zoom levels)
        if (zoomScale >= 200) {
            const userPos = latLonToPixel(activeUserLocation.lat, activeUserLocation.lon);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = Math.max(1.5, zoomScale * 0.008);

            const gridSpacing = zoomScale * 0.012;
            for (let i = -10; i <= 10; i++) {
                const offset = i * gridSpacing;

                // Horizontal Roads
                ctx.beginPath();
                ctx.moveTo(0, userPos.y + offset);
                ctx.lineTo(canvas.width, userPos.y + offset);
                ctx.stroke();

                // Vertical Roads
                ctx.beginPath();
                ctx.moveTo(userPos.x + offset, 0);
                ctx.lineTo(userPos.x + offset, canvas.height);
                ctx.stroke();
            }
        }

        // 3. Draw Shop Markers
        currentShops.forEach((shop) => {
            if (!shop.coordinates) return;

            const pos = latLonToPixel(shop.coordinates.lat, shop.coordinates.lng);
            const isHovered = shop.id === hoveredShopId;

            // Outer Glow ring on hover
            if (isHovered) {
                ctx.fillStyle = "rgba(99, 102, 241, 0.4)";
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
                ctx.fill();
            }

            // Pin Core
            ctx.fillStyle = isHovered ? "#a855f7" : "#22c55e";
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, isHovered ? 8 : 6, 0, Math.PI * 2);
            ctx.fill();

            // White Border around pin
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            if (zoomScale >= 400 || isHovered) {
                ctx.fillStyle = "#ffffff";
                ctx.font = isHovered ? "bold 12px 'Plus Jakarta Sans', sans-serif" : "600 11px 'Plus Jakarta Sans', sans-serif";
                ctx.fillText(shop.name, pos.x + 12, pos.y + 4);
            }
        });

        // 4. Draw User Home Marker
        const userPos = latLonToPixel(activeUserLocation.lat, activeUserLocation.lon);

        // Pulsing Home Aura
        ctx.fillStyle = "rgba(99, 102, 241, 0.25)";
        ctx.beginPath();
        ctx.arc(userPos.x, userPos.y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Main Home Pin
        ctx.fillStyle = "#6366f1";
        ctx.beginPath();
        ctx.arc(userPos.x, userPos.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Home Label
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("🏠 " + (activeUserLocation.address || "My Location"), userPos.x - 30, userPos.y - 15);
    }

    // Public API
    return {
        init,
        draw,
        zoom,
        setZoomTier,
        setShops,
        setUserLocation,
        centerOn
    };
})();