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
    announcement: "",
    freeShippingOver: 0,
    categories: [
      { name: "Necklaces", show: true },
      { name: "Rings", show: true },
      { name: "Men's Silver", show: true },
      { name: "Bundles", show: true }
    ],
    /* Delivery fee per governorate (sample prices, edit them from the admin panel). null means no delivery there. */
    shipping: {
      "cairo": 50, "giza": 50, "qalyubia": 55, "alexandria": 65, "port-said": 70, "suez": 70, "ismailia": 70,
      "dakahlia": 65, "sharqia": 65, "gharbia": 65, "monufia": 65, "beheira": 65, "kafr-el-sheikh": 70, "damietta": 70,
      "fayoum": 70, "beni-suef": 75, "minya": 80, "assiut": 85, "sohag": 90, "qena": 90, "luxor": 95, "aswan": 100,
      "red-sea": 100, "new-valley": 110, "matrouh": 100, "north-sinai": 110, "south-sinai": 110
    },
    payments: [
      { id: "cash", enabled: true, label: "Cash on delivery", note: "Pay in cash when your order arrives.", handle: "" },
      { id: "visa", enabled: true, label: "Visa / bank card", note: "We confirm the card payment details with you on WhatsApp.", handle: "" },
      { id: "instapay", enabled: true, label: "InstaPay", note: "Transfer the total to our InstaPay address, then send us the receipt on WhatsApp.", handle: "your-name@instapay" }
    ],
    theme: { preset: "midnight", bg: "#0b1426", ink: "#ede8dc", accent: "#d2ae5c", btn: "#d2ae5c", font: "classic", corners: "sharp", cols: 3 }
  },
  products: [
    { id: "p1", name: "Cartouche Name Pendant", category: "Necklaces", price: 650, images: ["img/cartouche-linen.jpg", "img/cartouche-stone.jpg"], desc: "Your name in Arabic letters on a vertical cartouche.", salePrice: 0, visible: true, soldOut: false },
    { id: "p2", name: "Hieroglyph Cartouche", category: "Necklaces", price: 690, images: ["img/cartouche-stone.jpg"], desc: "Horizontal cartouche with a lobster clasp chain.", salePrice: 0, visible: true, soldOut: false },
    { id: "p3", name: "Calligraphy Coin", category: "Necklaces", price: 720, images: ["img/coin-pendant.jpg"], desc: "Round medallion engraved in flowing Arabic script.", salePrice: 0, visible: true, soldOut: false },
    { id: "p4", name: "Triple Name Necklace", category: "Necklaces", price: 780, images: ["img/name-necklace.jpg"], desc: "Up to three names, spaced along a fine chain.", salePrice: 0, visible: true, soldOut: false },
    { id: "p5", name: "Two-Tone Love Ring", category: "Rings", price: 480, images: ["img/ring-love.jpg", "img/ring-signet.jpg"], desc: "Open silver band with a gold plate engraved by hand.", salePrice: 0, visible: true, soldOut: false },
    { id: "p6", name: "Two-Tone Name Ring", category: "Rings", price: 480, images: ["img/ring-signet.jpg"], desc: "Adjustable band, square gold plate with your word.", salePrice: 0, visible: true, soldOut: false }
  ]
};
