import { useEffect, useState, useCallback } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "orders";

/** Places a new order in Firestore. Returns the generated order number. */
export async function placeOrder({ orderNum, customer, items, subtotal, payment }) {
  await addDoc(collection(db, COLLECTION), {
    orderNum,
    customer,
    items,
    subtotal,
    payment,
    status: "New",
    createdAt: serverTimestamp(),
  });
  return orderNum;
}

/** Subscribes to the "orders" collection in Firestore in realtime, newest first. */
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Firestore orders listener error:", err);
        setError(err);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const updateOrderStatus = useCallback(async (id, status) => {
    return updateDoc(doc(db, COLLECTION, id), { status });
  }, []);

  const deleteOrder = useCallback(async (id) => {
    return deleteDoc(doc(db, COLLECTION, id));
  }, []);

  return { orders, loading, error, updateOrderStatus, deleteOrder };
}
