/**
 * CityGO - User Interface Module (ui.js)
 * Manages sidebar shop rendering, modal panels, image gallery, and user actions.
 */

const UI = (function () {

    /**
     * Renders the list of shop cards in the sidebar.
     */
    function renderShopList(shops) {
        const container = document.getElementById("shopListContainer");
        if (!container) return;

        container.innerHTML = "";

        if (!shops || shops.length === 0) {
            container.innerHTML = `<div style="padding: 1rem; color: #64748b;">No places found matching your search.</div>`;
            return;
        }

        shops.forEach((shop) => {
            const card = document.createElement("div");
            card.className = "shop-card";
            card.onclick = () => openShopDetails(shop.id);

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <h3 style="margin: 0; font-size: 1.05rem;">${shop.name}</h3>
                    <span style="font-weight: 700; color: #f59e0b; font-size: 0.85rem;">★ ${shop.rating}</span>
                </div>
                <div style="font-size: 0.8rem; font-weight: 600; color: #6366f1; margin: 0.2rem 0;">${shop.category}</div>
                <div style="font-size: 0.8rem; color: #64748b;">📍 ${shop.address}</div>
            `;
            container.appendChild(card);
        });

        // Update total counter badge if present
        const countBadge = document.getElementById("liveShopCount");
        if (countBadge) {
            countBadge.innerText = `${shops.length} Places Found`;
        }
    }

    /**
     * Opens the detailed shop drawer/modal panel.
     */
    function openShopDetails(shopId) {
        const shop = ShopsEngine.getShopById(shopId);
        if (!shop) return;

        const panel = document.getElementById("shopDetailPanel");
        if (!panel) return;

        // Focus map on this shop
        if (typeof MapEngine !== "undefined") {
            MapEngine.centerOn(shop.coordinates.lat, shop.coordinates.lng, 2200);
        }

        // Render Panel Content
        panel.innerHTML = `
            <span class="close-panel" onclick="UI.closeShopDetails()">✖ Close</span>
            
            <h2 style="margin: 0 0 0.2rem 0; font-size: 1.4rem;">${shop.name}</h2>
            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 0.8rem;">
                <span style="color: #f59e0b; font-weight: 800; font-size: 0.9rem;">★ ${shop.rating} (${shop.reviewCount} reviews)</span>
                <span style="font-size: 0.82rem; color: #64748b;">• ${shop.category}</span>
            </div>

            <!-- --- IMAGE GALLERY: 1 MAIN + 4 TOP PHOTOS --- -->
            <div class="gallery-container">
                <img src="${shop.mainImage}" alt="${shop.name} Main View" class="main-reference-img" id="featuredMainImg">
                
                <div class="top-images-grid">
                    ${shop.galleryImages.map((imgUrl, index) => `
                        <img src="${imgUrl}" alt="Photo ${index + 1}" onclick="UI.swapMainImage('${imgUrl}')">
                    `).join('')}
                </div>
            </div>

            <!-- ACTION BUTTONS: Call & Message -->
            <div class="action-buttons-group">
                <a href="tel:${shop.phone}" class="btn-action btn-call" style="text-decoration: none;">
                    📞 Call Shop
                </a>
                <a href="${shop.chatLink}" target="_blank" class="btn-action btn-message" style="text-decoration: none;">
                    💬 Message
                </a>
            </div>

            <div style="margin-top: 1rem; font-size: 0.85rem; color: #475569;">
                <strong>Address:</strong> ${shop.address}
            </div>

            <hr style="border: none; height: 1px; background: #e2e8f0; margin: 1.25rem 0;">

            <!-- REVIEWS SECTION -->
            <h3 style="font-size: 1.05rem; margin-bottom: 0.75rem;">Community Reviews</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${shop.reviews.map(r => `
                    <div style="background: #f8fafc; padding: 0.75rem; border-radius: 10px; border: 1px solid #f1f5f9;">
                        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.82rem;">
                            <span>${r.user}</span>
                            <span style="color: #f59e0b;">★ ${r.rating}</span>
                        </div>
                        <p style="margin: 0.3rem 0 0 0; font-size: 0.82rem; color: #475569;">"${r.comment}"</p>
                    </div>
                `).join('')}
            </div>
        `;

        panel.style.display = "block";
    }

    /**
     * Swaps the top featured reference image when clicking any of the 4 supporting photos.
     */
    function swapMainImage(newSrc) {
        const mainImg = document.getElementById("featuredMainImg");
        if (mainImg) {
            mainImg.src = newSrc;
        }
    }

    /**
     * Closes the detailed shop modal.
     */
    function closeShopDetails() {
        const panel = document.getElementById("shopDetailPanel");
        if (panel) {
            panel.style.display = "none";
        }
    }

    // Public API
    return {
        renderShopList,
        openShopDetails,
        closeShopDetails,
        swapMainImage
    };
})();