// ============================================================================
//  migrate-legacy-products.mjs   (OPTIONAL — run only if you have old products)
// ----------------------------------------------------------------------------
//  Products added with the OLD admin form were saved with human-readable,
//  3-level fields, e.g.:
//      { category: "Men", subcategory: "Shirts", variant: "Executive Formal Shirts" }
//
//  The storefront needs the 2-level slug shape, e.g.:
//      { category: "shirts", subcategory: "executive-formal-shirts" }
//
//  This script rewrites legacy docs to the new shape, best-effort, and lists
//  anything it can't confidently map so you can fix those by hand.
//
//  USAGE (from the OUTFIT-admin folder):
//      node scripts/migrate-legacy-products.mjs            # dry run, shows plan
//      node scripts/migrate-legacy-products.mjs --apply    # actually writes
// ============================================================================

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { TAXONOMY, CATEGORY_SLUGS } from "../src/data/taxonomy.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLxQCgv2rr_K3qbz8u7PbKVOaq7YTp6qg",
  authDomain: "outfit-ba0ea.firebaseapp.com",
  projectId: "outfit-ba0ea",
  storageBucket: "outfit-ba0ea.firebasestorage.app",
  messagingSenderId: "690800254815",
  appId: "1:690800254815:web:688f4a853208ba9be560ea",
};

const APPLY = process.argv.includes("--apply");
const db = getFirestore(initializeApp(firebaseConfig));

const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// label -> slug index, scoped per category slug
const labelIndex = {};
for (const cat of TAXONOMY) {
  labelIndex[cat.slug] = {};
  for (const g of cat.groups) for (const sub of g.subs) labelIndex[cat.slug][norm(sub.label)] = sub.slug;
}

// old category + old subcategory -> new category slug
function newCategoryFor(oldCat, oldSub) {
  const c = norm(oldCat), s = norm(oldSub);
  if (c === "accessories") return "accessories";
  if (c === "women") return "women-dresses";
  if (c === "men") {
    if (["shirts", "tshirts"].includes(s)) return "shirts";
    return "pants"; // denim / pants / shorts / activewear / tracks
  }
  if (c === "newarrivals") {
    if (s.includes("shirt")) return "shirts";
    return "pants"; // latest jeans / pants / shorts / tracks
  }
  return null;
}

function newSubFor(newCat, oldSub, variant) {
  if (newCat === "accessories") {
    const s = norm(oldSub);
    if (s.includes("watch")) return "watches";
    if (s.includes("chain")) return "chains";
  }
  // primary: match the old "variant" (3rd level) to a sub label
  const idx = labelIndex[newCat] || {};
  return idx[norm(variant)] || idx[norm(oldSub)] || null;
}

const run = async () => {
  const snap = await getDocs(collection(db, "products"));
  const plan = [];
  const skip = [];
  const unmapped = [];

  snap.forEach((d) => {
    const p = d.data();
    if (CATEGORY_SLUGS.includes(p.category)) { skip.push({ id: d.id, name: p.name }); return; } // already new

    const newCat = newCategoryFor(p.category, p.subcategory);
    const newSub = newCat ? newSubFor(newCat, p.subcategory, p.variant) : null;

    if (newCat && newSub) {
      plan.push({ id: d.id, name: p.name, from: `${p.category} / ${p.subcategory} / ${p.variant || "-"}`, to: `${newCat} / ${newSub}`, newCat, newSub });
    } else {
      unmapped.push({ id: d.id, name: p.name, cat: p.category, sub: p.subcategory, variant: p.variant });
    }
  });

  console.log(`\n${snap.size} products scanned`);
  console.log(`  ${skip.length} already use storefront slugs (skipped)`);
  console.log(`  ${plan.length} will be migrated`);
  console.log(`  ${unmapped.length} could NOT be auto-mapped\n`);

  plan.forEach((x) => console.log(`  • ${x.name}\n      ${x.from}\n      -> ${x.to}`));
  if (unmapped.length) {
    console.log(`\n  Needs manual fix (edit these in the admin Products page):`);
    unmapped.forEach((x) => console.log(`  • ${x.name}  [${x.cat} / ${x.sub} / ${x.variant || "-"}]`));
  }

  if (!APPLY) { console.log(`\nDry run only. Re-run with --apply to write these changes.\n`); return; }

  console.log(`\nApplying ${plan.length} updates...`);
  for (const x of plan) {
    await updateDoc(doc(db, "products", x.id), { category: x.newCat, subcategory: x.newSub });
    console.log(`  updated ${x.name}`);
  }
  console.log(`\nDone.\n`);
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });
