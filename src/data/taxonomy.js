// ============================================================================
//  taxonomy.js  —  SINGLE SOURCE OF TRUTH for storefront categories
// ============================================================================
//  The customer storefront finds products in Firestore with an EXACT match:
//
//      where("category",    "==", <category.slug>)
//      where("subcategory", "==", <sub.slug>)
//
//  (see the customer project:  src/pages/Products.jsx -> getProductsByCategory)
//
//  The storefront URL is:   /products/:category/:subcategory
//      :category     === one of the top-level slugs below
//                        (shirts | pants | accessories | women-dresses)
//      :subcategory  === one of the `slug` values below
//
//  So when the admin saves a product it MUST write:
//      { category: <top-level slug>, subcategory: <sub slug> }
//  and the product then shows up on the matching storefront page with no
//  manual wiring. Every slug/label below is copied verbatim from the customer
//  storefront's src/data/products.js so the two sides can never drift.
//
//  If you ever add a subcategory on the storefront, add the SAME slug here.
// ============================================================================

export const TAXONOMY = [
  {
    slug: "shirts",
    label: "Men · Shirts & T-Shirts",
    groups: [
      {
        key: "shirts",
        label: "Shirts",
        subs: [
          { slug: "executive-formal-shirts", label: "Executive Formal Shirts" },
          { slug: "smart-casual-shirts", label: "Smart Casual Shirts" },
          { slug: "classic-check-shirts", label: "Classic Check Shirts" },
          { slug: "premium-denim-shirts", label: "Premium Denim Shirts" },
          { slug: "signature-printed-shirts", label: "Signature Printed Shirts" },
          { slug: "luxury-corduroy-shirts", label: "Luxury Corduroy Shirts" },
          { slug: "imported-premium-shirts", label: "Imported Premium Shirts" },
          { slug: "pure-linen-shirts", label: "Pure Linen Shirts" },
          { slug: "party-wear-shirts", label: "Party Wear Shirts" },
          { slug: "office-wear-shirts", label: "Office Wear Shirts" },
        ],
      },
      {
        key: "tshirts",
        label: "T-Shirts",
        subs: [
          { slug: "polo-half-sleeve", label: "Polo T-Shirts (Half Sleeve)" },
          { slug: "polo-full-sleeve", label: "Polo T-Shirts (Full Sleeve)" },
          { slug: "oversized-drop-shoulder", label: "Oversized Drop Shoulder T-Shirts" },
          { slug: "half-sleeve-tshirts", label: "Half Sleeve T-Shirts" },
          { slug: "full-sleeve-tshirts", label: "Full Sleeve T-Shirts" },
          { slug: "graphic-printed-tshirts", label: "Graphic Printed T-Shirts" },
          { slug: "performance-dryfit", label: "Performance Dry-Fit T-Shirts" },
        ],
      },
    ],
  },
  {
    slug: "pants",
    label: "Men · Pants",
    groups: [
      {
        key: "jeans",
        label: "Jeans",
        subs: [
          { slug: "balloon-fit-jeans", label: "Balloon Fit Jeans" },
          { slug: "baggy-fit-jeans", label: "Baggy Fit Jeans" },
          { slug: "mom-fit-jeans", label: "Mom Fit Jeans" },
          { slug: "regular-fit-jeans", label: "Regular Fit Jeans" },
          { slug: "cargo-fit-jeans", label: "Cargo Fit Jeans" },
        ],
      },
      {
        key: "pants",
        label: "Pants",
        subs: [
          { slug: "linen-pants", label: "Linen Pants" },
          { slug: "imported-premium-pants", label: "Imported Premium Pants" },
          { slug: "korean-fit-pants", label: "Korean Fit Pants" },
          { slug: "cotton-pants", label: "Cotton Pants" },
          { slug: "cargo-pants", label: "Cargo Pants" },
        ],
      },
      {
        key: "trousers",
        label: "Trousers",
        subs: [
          { slug: "formal-trousers", label: "Formal Trousers" },
          { slug: "gurkha-trousers", label: "Gurkha Trousers" },
        ],
      },
      {
        key: "shorts",
        label: "Shorts",
        subs: [
          { slug: "cotton-shorts", label: "Cotton Shorts" },
          { slug: "denim-shorts", label: "Denim Shorts" },
          { slug: "performance-dryfit-shorts", label: "Performance Dry-Fit Shorts" },
        ],
      },
      {
        key: "tracks",
        label: "Tracks & Active Wear",
        subs: [
          { slug: "track-pants", label: "Track Pants" },
          { slug: "active-wear", label: "Active Wear" },
        ],
      },
    ],
  },
  {
    slug: "new-arrivals",
    label: "New Arrivals",
    groups: [
      {
        key: "latest",
        label: "Latest Drops",
        subs: [
          { slug: "latest-shirts", label: "Latest Shirts" },
          { slug: "latest-tshirts", label: "Latest T-Shirts" },
          { slug: "latest-jeans", label: "Latest Jeans" },
          { slug: "latest-pants", label: "Latest Pants" },
          { slug: "latest-shorts", label: "Latest Shorts" },
          { slug: "latest-tracks", label: "Latest Tracks" },
        ],
      },
    ],
  },
  {
    slug: "accessories",
    label: "Accessories",
    groups: [
      {
        key: "watches",
        label: "Watches",
        subs: [{ slug: "watches", label: "Watches" }],
      },
      {
        key: "chains",
        label: "Chains",
        subs: [{ slug: "chains", label: "Chains" }],
      },
    ],
  },
  {
    slug: "women-dresses",
    label: "Women",
    groups: [
      {
        key: "formalPants",
        label: "Formal Pants",
        subs: [
          { slug: "boot-cut-pants", label: "Boot Cut Pants" },
          { slug: "linen-trousers", label: "Linen Trousers" },
          { slug: "imported-stretch-pants", label: "Imported Stretch Pants" },
          { slug: "cotton-pants", label: "Cotton Pants" },
        ],
      },
      {
        key: "jeans",
        label: "Jeans",
        subs: [
          { slug: "wide-leg-jeans", label: "Wide Leg Jeans" },
          { slug: "boot-cut-jeans", label: "Boot Cut Jeans" },
          { slug: "straight-fit-jeans", label: "Straight Fit Jeans" },
          { slug: "baggy-fit-jeans", label: "Baggy Fit Jeans" },
          { slug: "high-rise-jeans", label: "High Rise Jeans" },
        ],
      },
      {
        key: "trousers",
        label: "Trousers",
        subs: [
          { slug: "casual-trousers", label: "Casual Trousers" },
          { slug: "linen-trousers-women", label: "Linen Trousers" },
        ],
      },
      {
        key: "tops",
        label: "Tops",
        subs: [
          { slug: "striped-shirts", label: "Striped Shirts" },
          { slug: "crop-tops", label: "Crop Tops" },
          { slug: "oversized-tshirts", label: "Oversized T-Shirts" },
          { slug: "formal-shirts", label: "Formal Shirts" },
        ],
      },
      {
        key: "kurti",
        label: "Kurti",
        subs: [
          { slug: "plain-kurti", label: "Plain Kurti" },
          { slug: "designer-kurti", label: "Designer Kurti" },
          { slug: "embroidered-kurti", label: "Embroidered Kurti" },
          { slug: "flared-kurti", label: "Flared Kurti" },
        ],
      },
      {
        key: "kurtaSets",
        label: "Kurta Sets",
        subs: [
          { slug: "embroidered-kurta-sets", label: "Embroidered Kurta Sets" },
          { slug: "palazzo-sets", label: "Palazzo Sets" },
          { slug: "georgette-sets", label: "Georgette Sets" },
        ],
      },
    ],
  },
];

// ---- Derived helpers --------------------------------------------------------

// [{ slug, label }] for the top-level category <select>
export const CATEGORY_OPTIONS = TAXONOMY.map((c) => ({ slug: c.slug, label: c.label }));

// Just the category slugs, handy for filters: ['shirts','pants',...]
export const CATEGORY_SLUGS = TAXONOMY.map((c) => c.slug);

const byCategory = Object.fromEntries(TAXONOMY.map((c) => [c.slug, c]));

// Nice display label for a stored category slug (falls back to the raw value)
export function labelForCategory(categorySlug) {
  return byCategory[categorySlug]?.label || categorySlug || "—";
}

// The groups ([{ key, label, subs }]) for a category — used to build <optgroup>s
export function groupsFor(categorySlug) {
  return byCategory[categorySlug]?.groups || [];
}

// Flat list of every { slug, label, group } under a category
export function subsFor(categorySlug) {
  return groupsFor(categorySlug).flatMap((g) =>
    g.subs.map((s) => ({ ...s, group: g.key, groupLabel: g.label }))
  );
}

// Display label for a stored subcategory slug (falls back to the raw value)
export function labelForSub(categorySlug, subSlug) {
  const hit = subsFor(categorySlug).find((s) => s.slug === subSlug);
  return hit?.label || subSlug || "—";
}

// Which group a subcategory belongs to (used to pick sensible size options)
export function groupKeyForSub(categorySlug, subSlug) {
  return subsFor(categorySlug).find((s) => s.slug === subSlug)?.group || null;
}

// ---- Size options -----------------------------------------------------------
const WAIST = ["26", "28", "30", "32", "34", "36", "38", "40"];
const ALPHA = ["XS", "S", "M", "L", "XL", "XXL"];

// Sensible size list for a given category + subcategory
export function sizesFor(categorySlug, subSlug) {
  if (categorySlug === "accessories") return ["One Size"];
  if (categorySlug === "new-arrivals") {
    // latest jeans/pants are bottoms → waist sizes; everything else alpha
    return ["latest-jeans", "latest-pants"].includes(subSlug) ? WAIST : ALPHA;
  }
  const group = groupKeyForSub(categorySlug, subSlug);
  // bottoms measured by waist; shorts/tracks/tops/kurtis use alpha sizing
  if (["jeans", "pants", "trousers", "formalPants"].includes(group)) {
    return categorySlug === "women-dresses" ? WAIST.slice(0, 6) : WAIST;
  }
  return ALPHA;
}
