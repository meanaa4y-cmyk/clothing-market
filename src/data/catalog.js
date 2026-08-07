/* ---------- Product catalog config ---------- */
/* Ported from the static demo. Generates a realistic-sized range per
   category from a small image pool + name/fabric banks so every
   category has enough stock to browse. */

const WOMEN_IMGS = [
  "33300909/pexels-photo-33300909", "20777203/pexels-photo-20777203",
  "36823461/pexels-photo-36823461", "20791983/pexels-photo-20791983",
  "36823460/pexels-photo-36823460", "20791992/pexels-photo-20791992",
  "33667874/pexels-photo-33667874", "33667873/pexels-photo-33667873",
  "20791993/pexels-photo-20791993", "33667866/pexels-photo-33667866",
];

const IMG_POOL = {
  unstitched: WOMEN_IMGS,
  ready: WOMEN_IMGS,
  luxury: WOMEN_IMGS,
};
const IMG_OFFSET = { unstitched: 0, ready: 3, luxury: 6 };

export const imgUrl = (path) =>
  path.startsWith("local:")
    ? path.slice(6)
    : `https://images.pexels.com/photos/${path}.jpeg?auto=compress&cs=tinysrgb&w=800`;

export const CATALOG_PLAN = [
  {
    cat: "unstitched", label: "Unstitched", count: 5,
    styles: ["2 Piece Embroidered Suit", "3 Piece Digital Printed Suit", "2 Piece Printed Suit", "3 Piece Lawn Suit", "2 Piece Karandi Suit", "3 Piece Embroidered Lawn"],
    tones: ["Vetiver", "Marbled Clay", "Faded Rose", "Dusty Sage", "Ivory Bloom", "Slate Mist", "Ochre Trail", "Blush Fern", "Charcoal Weave", "Amber Reed"],
    priceRange: [3290, 9990],
  },
  {
    cat: "ready", label: "Ready to Wear", count: 5,
    styles: ["Solid Tunic", "2 Piece Embroidered Suit", "Printed Dress", "A-Line Kurta", "Straight Shirt", "Panel Kurta"],
    tones: ["Sandstone", "Olive Hush", "Terracotta Bloom", "Rose Ash", "Powder Blue", "Wheat Field", "Clove", "Sage Linen", "Storm Grey"],
    priceRange: [2990, 7490],
  },
  {
    cat: "luxury", label: "Luxury Pret", count: 5,
    styles: ["3 Piece Embroidered Suit", "2 Piece Embroidered Suit", "Hand-Embellished Kurta Set", "Formal Chiffon Suit", "Sequinned Pret Set"],
    tones: ["Ivory Filigree", "Midnight Vine", "Emerald Trellis", "Gilded Rose", "Onyx Bloom", "Opaline Mist", "Rouge Lattice"],
    priceRange: [9990, 24990],
  },
  {
    cat: "men", label: "Men", count: 5,
    styles: ["Navy Blazer Suit", "Kurta Shalwar", "Formal Waistcoat Suit", "Solid Kurta", "Formal Shirt Kameez", "Yellow Festive Kurta", "Thobe Set", "Casual Sunglasses Kurta"],
    styleImages: [
      ""local:/images/men-navy-suit-2.jpg",",
      "35542192/pexels-photo-35542192",
      "13222257/pexels-photo-13222257",
      "28113665/pexels-photo-28113665",
      "16777497/pexels-photo-16777497",
      "34423748/pexels-photo-34423748",
      "8565796/pexels-photo-8565796",
      "26599787/pexels-photo-26599787",
    ],
    tones: ["Slate Weave", "Wheat Field", "Espresso", "Olive Bark", "Charcoal Grid", "Sandalwood", "Ash Grey"],
    priceRange: [3990, 12990],
  },
  {
    cat: "wraps", label: "Wraps", count: 10,
    styles: ["Embroidered Dupatta", "Printed Chiffon Wrap", "Woven Shawl", "Digital Printed Stole", "Net Dupatta", "Silk Stole", "Embellished Stole", "Printed Silk Wrap", "Chiffon Dupatta", "Woven Cotton Stole"],
    styleImages: [
      "local:/images/wrap-embroidered-gold-trellis.jpg",
      "local:/images/wrap-printed-chiffon-ivory.jpg",
      "local:/images/wrap-woven-shawl-dusty-rose.jpg",
      "local:/images/wrap-digital-stole-sage.jpg",
      "local:/images/wrap-net-dupatta-midnight.jpg",
      "local:/images/wrap-silk-stole-blush.jpg",
      "local:/images/wrap-embellished-ochre.jpg",
      "local:/images/wrap-printed-silk-slate.jpg",
      "20777203/pexels-photo-20777203",
      "36823461/pexels-photo-36823461",
    ],
    tones: ["Gold Trellis", "Ivory Bloom", "Dusty Rose", "Sage Weave", "Midnight Vine", "Blush Fern", "Ochre Trail", "Slate Mist", "Amber Reed", "Powder Blue"],
    priceRange: [1990, 6990],
  },
  {
    cat: "footwear", label: "Footwear", count: 9,
    styles: ["Beige Block Heels", "Strappy Sandals", "Glitter Closed-Toe Heels", "Flat-Soled Shoe", "Strappy Walking Heels", "Embellished Pair Heels", "White Peep-Toe Sandals", "Boutique Black Sandals", "Blue Studded Heels"],
    styleImages: [
      "local:/images/shoe-block-heels-beige.jpg",
      "local:/images/shoe-strappy-sandals-ivory.jpg",
      "local:/images/shoe-glitter-heels-espresso.jpg",
      "local:/images/shoe-flat-rose-gold.jpg",
      "local:/images/shoe-strappy-walking-charcoal.jpg",
      "local:/images/shoe-embellished-sandstone.jpg",
      "local:/images/shoe-peep-toe-white.jpg",
      "local:/images/shoe-boutique-black.jpg",
      "local:/images/shoe-studded-blue.jpg",
    ],
    tones: ["Beige Suede", "Ivory Pearl", "Espresso", "Rose Gold", "Charcoal", "Sandstone", "White", "Black", "Blue"],
    priceRange: [2490, 8990],
  },
  {
    cat: "bags", label: "Bags", count: 11,
    styles: ["Canvas Tote Bag", "Leather Shoulder Bag", "Structured Handbag", "Colourblock Handbag", "Everyday Tote", "Quilted Tote Bag", "Minimalist Tote", "Studio Tote Bag", "Turquoise Leather Handbag", "Bamboo-Handle Leather Bag", "Chic Crossbody Bag"],
    styleImages: [
      "local:/images/bag-canvas-tote-natural.jpg",
      "local:/images/bag-leather-shoulder-espresso.jpg",
      "local:/images/bag-structured-charcoal.jpg",
      "local:/images/bag-colourblock-rose-ash.jpg",
      "local:/images/bag-everyday-tote-sandstone.jpg",
      "local:/images/bag-quilted-tote-blush.jpg",
      "8148587/pexels-photo-8148587",
      "local:/images/bag-studio-tote-ivory.jpg",
      "local:/images/bag-turquoise-handbag-teal.jpg",
      "local:/images/bag-bamboo-handle-onyx.jpg",
      "local:/images/bag-crossbody-olive.jpg",
    ],
    tones: ["Natural Weave", "Espresso", "Charcoal", "Rose Ash", "Sandstone", "Blush Satin", "Tan", "Ivory Pearl", "Teal", "Onyx", "Olive Bark"],
    priceRange: [2990, 9990],
  },
];

export function buildCatalog() {
  let id = 1;
  const list = [];
  CATALOG_PLAN.forEach((plan) => {
    for (let i = 0; i < plan.count; i++) {
      const styleIdx = i % plan.styles.length;
      const style = plan.styles[styleIdx];
      const tone = plan.tones[i % plan.tones.length];
      const [lo, hi] = plan.priceRange;
      const price = Math.round((lo + ((hi - lo) * ((i * 37) % 100)) / 100) / 10) * 10;
      const onSale = i % 4 === 1;

      let imgPath;
      if (plan.styleImages) {
        imgPath = plan.styleImages[styleIdx % plan.styleImages.length];
      } else {
        const pool = IMG_POOL[plan.cat];
        const offset = IMG_OFFSET[plan.cat] || 0;
        const poolIndex = (i + offset) % pool.length;
        imgPath = pool[poolIndex];
      }

      list.push({
        id: id++,
        name: `${style} — ${tone}`,
        cat: plan.cat,
        label: plan.label,
        price: onSale ? Math.round((price * 0.8) / 10) * 10 : price,
        oldPrice: onSale ? price : null,
        isNew: i % 3 !== 0,
        img: imgUrl(imgPath),
      });
    }
  });
  return list;
}

export const PRODUCTS = buildCatalog();

export const fmt = (n) => "Rs. " + n.toLocaleString();

export const CATEGORY_LABELS = {
  all: "All", unstitched: "Unstitched", ready: "Ready to Wear",
  luxury: "Luxury Pret", men: "Men", accessories: "Accessories",
  wraps: "Wraps", footwear: "Footwear", bags: "Bags",
};

export function currentList(products, filter) {
  if (filter === "all") return products;
  if (filter === "accessories") return products.filter((p) => ["wraps", "footwear", "bags"].includes(p.cat));
  return products.filter((p) => p.cat === filter);
}

export function searchProducts(products, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name?.toLowerCase().includes(q) ||
      p.label?.toLowerCase().includes(q) ||
      p.cat?.toLowerCase().includes(q)
  );
}

export const CATEGORY_OPTIONS = ["unstitched", "ready", "luxury", "men", "wraps", "footwear", "bags"];

export const PANELS = [
  { label: "Unstitched", img: "https://images.pexels.com/photos/33300909/pexels-photo-33300909.jpeg?auto=compress&cs=tinysrgb&w=900", filter: "unstitched" },
  { label: "Ready to Wear", img: "https://images.pexels.com/photos/33667873/pexels-photo-33667873.jpeg?auto=compress&cs=tinysrgb&w=900", filter: "ready" },
  { label: "Freedom to Buy", img: "https://images.pexels.com/photos/20791983/pexels-photo-20791983.jpeg?auto=compress&cs=tinysrgb&w=900", filter: "all" },
];

export const HERO_SLIDES = [
  { img: "https://images.pexels.com/photos/20791992/pexels-photo-20791992.jpeg?auto=compress&cs=tinysrgb&w=1600", eyebrow: "Summer '26 Edit", title: "Freedom to Buy", filter: "all" },
  { img: "https://images.pexels.com/photos/33667874/pexels-photo-33667874.jpeg?auto=compress&cs=tinysrgb&w=1600", eyebrow: "New In", title: "Unstitched Collection", filter: "unstitched" },
  { img: "https://images.pexels.com/photos/8621669/pexels-photo-8621669.jpeg?auto=compress&cs=tinysrgb&w=1600", eyebrow: "Menswear", title: "Ready to Wear — Men", filter: "men" },
  { img: "https://images.pexels.com/photos/33667866/pexels-photo-33667866.jpeg?auto=compress&cs=tinysrgb&w=1600", eyebrow: "Occasion Wear", title: "Luxury Pret", filter: "luxury" },
];

export const ANNOUNCEMENTS = [
  'Unlock free shipping on nationwide paid orders <a href="#products">Shop Now</a>',
  'New arrivals every week — see what just landed <a href="#products">Shop Now</a>',
  'Sale up to 50% off select styles <a href="#products">Shop Now</a>',
];
