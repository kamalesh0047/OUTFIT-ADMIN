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
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const productsRef = collection(db, "products");

export async function getProducts() {
  const snapshot = await getDocs(productsRef);

  return snapshot.docs.map((d) => {
    const data = d.data();

    return {
      id: d.id,
      ...data,
      brand: data.brand || "OUTFIT",
      rating: data.rating ?? 5,
      reviews: data.reviews ?? 0,
      colors: data.colors || [],
      sizes: data.sizes || [],
      gallery: data.gallery || [data.imageUrl || data.image],
      specs: data.specs || [],
      care: data.care || [],
      image: data.image || data.imageUrl || "",
      imageUrl: data.imageUrl || data.image || "",
      stock: data.stock ?? 100,
    };
  });
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
    q = query(
      productsRef,
      where("category", "==", category)
    );
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => {
    const data = d.data();

    return {
      id: d.id,
      ...data,
      brand: data.brand || "OUTFIT",
      rating: data.rating ?? 5,
      reviews: data.reviews ?? 0,
      colors: data.colors || [],
      sizes: data.sizes || [],
      gallery: data.gallery || [data.imageUrl || data.image],
      specs: data.specs || [],
      care: data.care || [],
      image: data.image || data.imageUrl || "",
      imageUrl: data.imageUrl || data.image || "",
      stock: data.stock ?? 100,
    };
  });
}

export async function getProduct(id) {
  const snapshot = await getDoc(doc(db, "products", id));

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
    brand: data.brand || "OUTFIT",
    rating: data.rating ?? 5,
    reviews: data.reviews ?? 0,
    colors: data.colors || [],
    sizes: data.sizes || [],
    gallery: data.gallery || [data.imageUrl || data.image],
    specs: data.specs || [],
    care: data.care || [],
    image: data.image || data.imageUrl || "",
    imageUrl: data.imageUrl || data.image || "",
    stock: data.stock ?? 100,
  };
}

export async function addProduct(product) {
  await addDoc(productsRef, {
    ...product,
    sold: product.sold ?? 0,
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(id, updates) {
  await updateDoc(doc(db, "products", id), updates);
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
}