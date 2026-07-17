// ============================================================================
//  AdminData.jsx  —  live Firestore data for the whole admin panel
// ============================================================================
//  ONE place subscribes to the shared Firestore database (the same one the
//  customer storefront uses) and streams products + orders in real time.
//  Every admin page reads from here via useAdminData(), so:
//
//    • a product added in Products appears instantly everywhere
//    • an order placed on the storefront pops a toast + a badge here, live
//    • stock changes on either side reflect immediately
//
//  Collections used (must match the storefront):  "products", "orders".
// ============================================================================

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { emitToast } from "./AppContext";

// "Pending" is what the storefront writes for a new order — keep it first.
export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// Firestore Timestamp | ISO string | millis -> JS Date (or null)
export function toDate(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate();
  if (typeof ts.seconds === "number") return new Date(ts.seconds * 1000);
  const d = new Date(ts);
  return isNaN(d.getTime()) ? null : d;
}

// Map a raw order doc (new storefront shape OR legacy shape) to what the UI wants
export function normalizeOrder(id, d = {}) {
  const created = toDate(d.createdAt) || toDate(d.placedAt);
  const addr = d.address || {};
  return {
    id,
    status: d.status || "Pending",
    total: Number(d.total) || 0,
    subtotal: Number(d.subtotal) || 0,
    items: Array.isArray(d.items) ? d.items : [],
    userId: d.userId || "guest",
    // storefront writes `customerName`; legacy data used `userName`
    userName: d.customerName || d.userName || "Guest",
    userEmail: d.userEmail || d.email || "",
    phone: d.phone || "",
    paymentMethod: d.paymentMethod || "",
    paymentStatus: d.paymentStatus || "",
    paymentId: d.paymentId || "",
    razorpayOrderId: d.razorpayOrderId || "",
    address: addr,
    city: addr.city || "",
    createdAt: created,
    placedAt: created ? created.toISOString() : null,
  };
}

// Map a raw product doc to a consistent shape (image/price/stock fallbacks)
export function normalizeProduct(id, d = {}) {
  const gallery =
    Array.isArray(d.gallery) && d.gallery.length
      ? d.gallery.filter(Boolean)
      : Array.isArray(d.images) && d.images.length
      ? d.images.filter(Boolean)
      : (d.image || d.imageUrl ? [d.image || d.imageUrl] : []);
  return {
    ...d,
    id,
    price: Number(d.price) || 0,
    originalPrice: d.originalPrice != null && d.originalPrice !== "" ? Number(d.originalPrice) : "",
    stock: Number(d.stock ?? 0),
    sold: Number(d.sold ?? 0),
    image: gallery[0] || d.image || d.imageUrl || "",
    imageUrl: gallery[0] || d.imageUrl || d.image || "",
    gallery,
    images: gallery,
    isOffer: d.isOffer === true,
    category: d.category || "",
    subcategory: d.subcategory || "",
  };
}

// Recompute the same analytics the old localStorage store produced
export function computeAnalytics(products = [], orders = []) {
  const live = orders.filter((o) => o.status !== "Cancelled");
  const revenue = live.reduce((s, o) => s + (o.total || 0), 0);
  const topProducts = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5);

  const map = {};
  orders.forEach((o) => {
    const d = o.createdAt;
    if (!d) return;
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map[m]) map[m] = { month: m, revenue: 0, count: 0 };
    map[m].revenue += o.total || 0;
    map[m].count++;
  });
  const monthlySales = Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  // No Firestore "users" collection exists — customers are derived from orders.
  const usersCount = new Set(orders.map((o) => o.userId).filter((u) => u && u !== "guest")).size;

  return {
    revenue,
    ordersCount: orders.length,
    productsCount: products.length,
    usersCount,
    topProducts,
    monthlySales,
  };
}

// Update an order's status directly in Firestore (reflects on storefront too)
export function updateOrderStatus(id, status) {
  return updateDoc(doc(db, "orders", id), { status });
}

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);

  // remembers order ids we've already seen so we can toast only genuinely new ones
  const seenOrderIds = useRef(null);

  useEffect(() => {
    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snap) => {
        setProducts(snap.docs.map((x) => normalizeProduct(x.id, x.data())));
        setProductsLoading(false);
      },
      (err) => {
        console.error("[AdminData] products listener failed:", err);
        setError(err);
        setProductsLoading(false);
      }
    );

    const unsubOrders = onSnapshot(
      collection(db, "orders"),
      (snap) => {
        const list = snap.docs
          .map((x) => normalizeOrder(x.id, x.data()))
          .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

        // Notify on new orders — but not on the very first snapshot (existing data)
        if (seenOrderIds.current === null) {
          seenOrderIds.current = new Set(list.map((o) => o.id));
        } else {
          const fresh = list.filter((o) => !seenOrderIds.current.has(o.id));
          fresh.forEach((o) => {
            seenOrderIds.current.add(o.id);
            emitToast(`New order from ${o.userName} — ₹ ${o.total.toLocaleString("en-IN")}`);
          });
        }

        setOrders(list);
        setOrdersLoading(false);
      },
      (err) => {
        console.error("[AdminData] orders listener failed:", err);
        setError(err);
        setOrdersLoading(false);
      }
    );

    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, []);

  const analytics = useMemo(() => computeAnalytics(products, orders), [products, orders]);
  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === "Pending").length,
    [orders]
  );

  const value = useMemo(
    () => ({
      products,
      orders,
      analytics,
      pendingOrders,
      loading: productsLoading || ordersLoading,
      productsLoading,
      ordersLoading,
      error,
    }),
    [products, orders, analytics, pendingOrders, productsLoading, ordersLoading, error]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used inside <AdminDataProvider>");
  return ctx;
}
