/* ==========================================================================
   CITYGO SYSTEM ARCHITECTURE - CENTRAL VENUE DATABASE
   ==========================================================================
   File Name: js/shop.js
   Role: Master dataset storing venue details, geolocation coordinates,
         gallery assets, pricing tiers, and verified user reviews.
   Dependencies: None (Loaded first in script execution order)
   ========================================================================== */

const CITYGO_DATABASE = [
  {
    id: "cg-shop-001",
    name: "L'Aura Pastry Atelier",
    category: "bakery",
    categoryLabel: "🥐 Artisanal Bakery",
    rating: 4.9,
    reviewsCount: 342,
    priceRange: "$$$",
    address: "742 Evergreen Avenue, Manhattan, NY",
    lat: 40.7135,
    lng: -74.0045,
    hours: "7:00 AM - 7:00 PM",
    description: "An elegant, sun-drenched French pastry shop famous for hand-laminated saffron croissants, edible flower tartlets, and organic cloud matcha lattes.",
    thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        author: "Sophie V.",
        rating: 5,
        comment: "The saffron croissant is an incredible experience. Bright white interior, stunning marble tables, and incredibly warm service!"
      },
      {
        author: "Marcus K.",
        rating: 5,
        comment: "Best aesthetic bakery in the neighborhood. Perfectly airy seating area and top-notch espresso."
      }
    ]
  },
  {
    id: "cg-shop-002",
    name: "Maison de L'Étoile",
    category: "restaurant",
    categoryLabel: "🍷 Fine Dining",
    rating: 4.8,
    reviewsCount: 512,
    priceRange: "$$$$",
    address: "180 Mercer Street, SoHo, NY",
    lat: 40.7250,
    lng: -73.9980,
    hours: "5:30 PM - 11:00 PM",
    description: "A Michelin-starred minimalist culinary haven offering seasonal botanical tasting menus paired with natural biodynamic wines in an ultra-clean, pearl-white setting.",
    thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        author: "Elena Rostova",
        rating: 5,
        comment: "Pure elegance. Every course felt like a piece of contemporary art. Highly recommend the truffle infusion."
      },
      {
        author: "David L.",
        rating: 4,
        comment: "Exceptional atmosphere and service. Make sure to book weeks in advance!"
      }
    ]
  },
  {
    id: "cg-shop-003",
    name: "Cloud Nine Specialty Coffee",
    category: "cafe",
    categoryLabel: "☕ Specialty Cafe",
    rating: 4.7,
    reviewsCount: 289,
    priceRange: "$$",
    address: "42 Bleecker Street, Greenwich Village, NY",
    lat: 40.7265,
    lng: -73.9940,
    hours: "8:00 AM - 6:00 PM",
    description: "An airy, bubbly minimalist cafe featuring micro-lot pour-overs, house-made oat milk froth art, and fluffy Japanese soufflé pancakes.",
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        author: "Chloe M.",
        rating: 5,
        comment: "The soufflé pancakes literally melt in your mouth! Perfect bright, clean space to do light work or catch up with friends."
      },
      {
        author: "Jordan P.",
        rating: 4,
        comment: "Fantastic single-origin pour over. Soft light and super friendly baristas."
      }
    ]
  },
  {
    id: "cg-shop-004",
    name: "Solis Botanical Spa & Sanctuary",
    category: "spa",
    categoryLabel: "🌸 Spas & Wellness",
    rating: 4.9,
    reviewsCount: 198,
    priceRange: "$$$",
    address: "512 Hudson Street, Tribeca, NY",
    lat: 40.7310,
    lng: -74.0080,
    hours: "9:00 AM - 8:00 PM",
    description: "A luxury wellness sanctuary offering glowing white quartz hydrotherapy pools, bio-luminous facial treatments, and aromatherapy eucalyptus lounges.",
    thumbnail: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        author: "Aria Montgomery",
        rating: 5,
        comment: "The hydrotherapy pool is divine. You leave feeling completely renewed and glowing!"
      },
      {
        author: "Liam T.",
        rating: 5,
        comment: "Flawless service, heavenly scent profiles throughout the building, and beautiful minimalist aesthetic."
      }
    ]
  },
  {
    id: "cg-shop-005",
    name: "Bloom & Batter Sugar Studio",
    category: "bakery",
    categoryLabel: "🥐 Artisanal Bakery",
    rating: 4.8,
    reviewsCount: 176,
    priceRange: "$$",
    address: "305 Spring Street, SoHo, NY",
    lat: 40.7258,
    lng: -74.0051,
    hours: "8:00 AM - 6:30 PM",
    description: "A pastel white boutique bakery crafting rose-water macarons, cardamom buns, and custom sculpted occasion cakes.",
    thumbnail: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        author: "Hannah B.",
        rating: 5,
        comment: "Their macarons are perfection. Crispy on the outside, soft on the inside, and not overly sweet!"
      }
    ]
  },
  {
    id: "cg-shop-006",
    name: "Aura Matcha & Light Lab",
    category: "cafe",
    categoryLabel: "☕ Specialty Cafe",
    rating: 4.9,
    reviewsCount: 410,
    priceRange: "$$",
    address: "88 Grand Street, Williamsburg, NY",
    lat: 40.7150,
    lng: -73.9620,
    hours: "7:30 AM - 5:00 PM",
    description: "A ceremonial-grade Uji matcha bar serving whipped strawberry matcha, lavender cold foams, and house-baked mochi treats in an ultra-clean space.",
    thumbnail: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      {
        author: "Kenji S.",
        rating: 5,
        comment: "The highest quality matcha in NYC. Smooth, rich, vibrant green, and never bitter."
      }
    ]
  }
];

// Freeze database object to ensure state immutability
Object.freeze(CITYGO_DATABASE);