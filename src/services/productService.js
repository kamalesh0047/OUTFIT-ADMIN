import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

/** Normalize a Firestore product doc into a consistent shape used across the app */
export function normalizeProduct(id, data = {}) {
  const image = data.image || data.imageUrl || "";
  const gallery =
    Array.isArray(data.gallery) && data.gallery.length
      ? data.gallery.filter(Boolean)
      : Array.isArray(data.images) && data.images.length
      ? data.images.filter(Boolean)
      : image
      ? [image]
      : [];

  const price = Number(data.price) || 0;
  const originalPrice = Number(data.originalPrice || data.original || 0) || null;

  return {
    id,
    ...data,
    brand: data.brand || "OUTFIT",
    rating: data.rating ?? 5,
    reviews: data.reviews ?? 0,
    colors: data.colors || [],
    sizes: data.sizes || [],
    gallery,
    images: gallery,
    specs: data.specs || [],
    care: data.care || [],
    image: gallery[0] || image,
    imageUrl: gallery[0] || image,
    stock: data.stock ?? 0,
    price,
    originalPrice,
    original: originalPrice,
    onSale: data.onSale || (originalPrice && originalPrice > price),
    isOffer: !!data.isOffer,
    offerPrice: data.offerPrice != null ? Number(data.offerPrice) : null,
  };
}

export async function getProducts() {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map((d) => normalizeProduct(d.id, d.data()));
}

export async function getProductsByCategory(category, subcategory = null) {
  let q;
  if (subcategory) {
    q = query(
      collection(db, "products"),
      where("category", "==", category),
      where("subcategory", "==", subcategory)
    );
  } else {
    q = query(collection(db, "products"), where("category", "==", category));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizeProduct(d.id, d.data()));
}

export async function getProduct(id) {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return normalizeProduct(snap.id, snap.data());
}

/** Real-time subscription to all products. Returns unsubscribe function. */
export function subscribeProducts(callback) {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => normalizeProduct(d.id, d.data()));
      callback(list);
    },
    (err) => {
      console.error("Products subscription error:", err);
      // Fallback without orderBy if index missing
      return onSnapshot(collection(db, "products"), (snap) => {
        const list = snap.docs.map((d) => normalizeProduct(d.id, d.data()));
        callback(list);
      });
    }
  );
}

/** Real-time subscription for a single product */
export function subscribeProduct(id, callback) {
  return onSnapshot(doc(db, "products", id), (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    callback(normalizeProduct(snap.id, snap.data()));
  });
}

export async function getOfferProducts() {
  const q = query(
    collection(db, "products"),
    where("isOffer", "==", true),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizeProduct(d.id, d.data()));
}

export function subscribeOfferProducts(callback) {
  // Strict: only docs where isOffer is boolean true
  const q = query(collection(db, "products"), where("isOffer", "==", true));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => normalizeProduct(d.id, d.data()))
        .filter((p) => p.isOffer === true);
      callback(list);
    },
    (err) => {
      console.error("Offer subscription error:", err);
      callback([]);
    }
  );
}
