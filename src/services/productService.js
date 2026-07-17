import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const productsRef = collection(db, "products");

function normalize(id, data = {}) {
  const image = data.image || data.imageUrl || "";
  const gallery =
    Array.isArray(data.gallery) && data.gallery.length
      ? data.gallery.filter(Boolean)
      : Array.isArray(data.images) && data.images.length
      ? data.images.filter(Boolean)
      : image
      ? [image]
      : [];

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
    price: Number(data.price) || 0,
    originalPrice: data.originalPrice != null ? Number(data.originalPrice) : null,
    onSale: data.onSale || false,
    isOffer: !!data.isOffer,
  };
}

export async function getProducts() {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((d) => normalize(d.id, d.data()));
}

export function subscribeProducts(callback) {
  return onSnapshot(
    query(productsRef, orderBy("createdAt", "desc")),
    (snap) => callback(snap.docs.map((d) => normalize(d.id, d.data()))),
    () =>
      onSnapshot(productsRef, (snap) =>
        callback(snap.docs.map((d) => normalize(d.id, d.data())))
      )
  );
}

export async function getProductsByCategory(category, subcategory = null) {
  let q;
  if (subcategory) {
    q = query(
      productsRef,
      where("category", "==", category),
      where("subcategory", "==", subcategory)
    );
  } else {
    q = query(productsRef, where("category", "==", category));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => normalize(d.id, d.data()));
}

export async function getProduct(id) {
  const snapshot = await getDoc(doc(db, "products", id));
  if (!snapshot.exists()) return null;
  return normalize(snapshot.id, snapshot.data());
}

export async function addProduct(product) {
  const gallery = product.gallery || product.images || (product.imageUrl ? [product.imageUrl] : []);
  await addDoc(productsRef, {
    ...product,
    gallery,
    images: gallery,
    image: gallery[0] || product.imageUrl || "",
    imageUrl: gallery[0] || product.imageUrl || "",
    sold: product.sold ?? 0,
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(id, updates) {
  const payload = { ...updates };
  if (payload.gallery || payload.images) {
    const g = payload.gallery || payload.images || [];
    payload.gallery = g;
    payload.images = g;
    payload.image = g[0] || "";
    payload.imageUrl = g[0] || "";
  }
  if ("isOffer" in payload) {
    payload.isOffer = payload.isOffer === true;
  }
  await updateDoc(doc(db, "products", id), payload);
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
}
