/**
 * CityGO - Shops & Data Engine Module (shops.js)
 * Manages dataset, filtering, and retrieval of shops, places, and recommendations.
 */

const ShopsEngine = (function () {
    // Master Dataset: Includes 1 main image + 4 top gallery photos per location
    let shopDatabase = [
        {
            id: "shop_101",
            name: "Grand Horizon Shopping Plaza",
            category: "Shopping Mall",
            rating: 4.8,
            reviewCount: 320,
            phone: "+15550192834",
            email: "contact@grandhorizon.com",
            chatLink: "https://wa.me/15550192834",
            address: "450 Grand Ave, Downtown",
            coordinates: { lat: 34.0562, lng: -118.2382 },
            mainImage: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80",
            galleryImages: [
                "https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=300&q=80"
            ],
            reviews: [
                { user: "Sarah L.", rating: 5, comment: "Amazing place! Tons of stores and great food court." },
                { user: "David M.", rating: 4, comment: "Very spacious, parking is easy to find." }
            ]
        },
        {
            id: "shop_102",
            name: "Artisan Coffee & Bakery",
            category: "Café & Bakery",
            rating: 4.9,
            reviewCount: 185,
            phone: "+15550183344",
            email: "hello@artisancoffee.com",
            chatLink: "https://wa.me/15550183344",
            address: "122 Main Street, District 4",
            coordinates: { lat: 34.0487, lng: -118.2489 },
            mainImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
            galleryImages: [
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=300&q=80"
            ],
            reviews: [
                { user: "Emma W.", rating: 5, comment: "Best espresso and sourdough pastries in the city!" }
            ]
        },
        {
            id: "shop_103",
            name: "Skyline Luxury Suites",
            category: "Hotel & Apartment",
            rating: 4.7,
            reviewCount: 94,
            phone: "+15550129988",
            email: "stay@skylinesuites.com",
            chatLink: "https://wa.me/15550129988",
            address: "88 Tower Road",
            coordinates: { lat: 34.0580, lng: -118.2510 },
            mainImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            galleryImages: [
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=300&q=80"
            ],
            reviews: [
                { user: "Alex K.", rating: 5, comment: "Breathtaking views and top-tier service." }
            ]
        }
    ];

    /**
     * Gets all shops in database.
     */
    function getAllShops() {
        return shopDatabase;
    }

    /**
     * Finds a shop by unique ID.
     */
    function getShopById(id) {
        return shopDatabase.find(shop => shop.id === id);
    }

    /**
     * Filters shops by search query or category.
     */
    function filterShops(query = "", category = "") {
        const q = query.toLowerCase().trim();
        return shopDatabase.filter(shop => {
            const matchesQuery = !q || shop.name.toLowerCase().includes(q) || shop.category.toLowerCase().includes(q);
            const matchesCategory = !category || shop.category === category;
            return matchesQuery && matchesCategory;
        });
    }

    /**
     * Calculates distance between user location and a shop (in km).
     */
    function getDistance(userLat, userLng, shopLat, shopLng) {
        const R = 6371; // Earth's radius in km
        const dLat = (shopLat - userLat) * Math.PI / 180;
        const dLon = (shopLng - userLng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(userLat * Math.PI / 180) * Math.cos(shopLat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    }

    // Public API
    return {
        getAllShops,
        getShopById,
        filterShops,
        getDistance
    };
})();