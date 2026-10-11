/* Starting data for the store. Used until the first save from the admin panel,
   and as a fallback if the saved data cannot be loaded. */
window.DEFAULT_STORE = {
  store: {
    name: "Bracelet",
    whatsapp: "201000000000",
    currency: "EGP",
    heroEyebrow: "Arabic name jewelry",
    heroTitle: "Your name, set in gold.",
    heroLead: "Pendants, necklaces and rings engraved in Arabic calligraphy and Egyptian cartouches. Pick a piece, tell us the name, and we make it for you.",
    heroImage: "img/cartouche-linen.jpg",
    heroCaption: "Cartouche pendant, 18k gold plated",
    perks: [
      ["Made to order", "Ready in 5 to 7 days"],
      ["Gold PVD finish", "Water and sweat resistant"],
      ["Cash on delivery", "Shipping across Egypt"]
    ],
    theme: { preset: "midnight", bg: "#0b1426", ink: "#ede8dc", accent: "#d2ae5c", btn: "#d2ae5c", font: "classic", corners: "sharp", cols: 3 }
  },
  products: [
    { id: "p1", name: "Cartouche Name Pendant", category: "Necklaces", price: 650, images: ["img/cartouche-linen.jpg", "img/cartouche-stone.jpg"], desc: "Your name in Arabic letters on a vertical cartouche.", visible: true, soldOut: false },
    { id: "p2", name: "Hieroglyph Cartouche", category: "Necklaces", price: 690, images: ["img/cartouche-stone.jpg"], desc: "Horizontal cartouche with a lobster clasp chain.", visible: true, soldOut: false },
    { id: "p3", name: "Calligraphy Coin", category: "Necklaces", price: 720, images: ["img/coin-pendant.jpg"], desc: "Round medallion engraved in flowing Arabic script.", visible: true, soldOut: false },
    { id: "p4", name: "Triple Name Necklace", category: "Necklaces", price: 780, images: ["img/name-necklace.jpg"], desc: "Up to three names, spaced along a fine chain.", visible: true, soldOut: false },
    { id: "p5", name: "Two-Tone Love Ring", category: "Rings", price: 480, images: ["img/ring-love.jpg", "img/ring-signet.jpg"], desc: "Open silver band with a gold plate engraved by hand.", visible: true, soldOut: false },
    { id: "p6", name: "Two-Tone Name Ring", category: "Rings", price: 480, images: ["img/ring-signet.jpg"], desc: "Adjustable band, square gold plate with your word.", visible: true, soldOut: false }
  ]
};
