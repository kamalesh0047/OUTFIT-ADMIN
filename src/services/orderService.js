import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export async function placeOrder(order) {
  // 1) write the order to the shared "orders" collection (admin reads this live)
  const ref = await addDoc(collection(db, "orders"), {
    ...order,
    status: "Pending",
    createdAt: serverTimestamp(),
  });

  // 2) keep inventory in sync — decrement stock and bump `sold` per line item.
  //    Done best-effort and per-item so one bad id can't fail the whole order.
  const items = Array.isArray(order.items) ? order.items : [];
  await Promise.all(
    items.map(async (it) => {
      if (!it || typeof it.id !== "string") return; // only real Firestore product ids
      const qty = Number(it.qty) || 1;
      try {
        await updateDoc(doc(db, "products", it.id), {
          stock: increment(-qty),
          sold: increment(qty),
        });
      } catch (err) {
        console.error(`Stock update skipped for product ${it.id}:`, err);
      }
    })
  );

  return ref.id;
}

export async function getUserOrders(uid) {
  // newest first; if the index isn't ready Firestore still returns unordered,
  // so we also sort client-side as a safety net.
  let snap;
  try {
    snap = await getDocs(
      query(
        collection(db, "orders"),
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      )
    );
  } catch (err) {
    console.warn("Ordered query failed, falling back to unordered:", err);
    snap = await getDocs(query(collection(db, "orders"), where("userId", "==", uid)));
  }

  const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  orders.sort((a, b) => {
    const ta = a.createdAt?.seconds || 0;
    const tb = b.createdAt?.seconds || 0;
    return tb - ta;
  });

  return orders;
}
