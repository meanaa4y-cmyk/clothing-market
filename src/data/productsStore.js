import { useEffect, useState, useCallback, useRef } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { PRODUCTS as SEED_PRODUCTS } from "./catalog";

const COLLECTION = "products";

/**
 * Subscribes to the "products" collection in Firestore in realtime.
 * If Firestore has no products yet, automatically writes the locally
 * generated demo catalog in as real documents, so every product the
 * storefront shows is always a real, editable/deletable Firestore doc
 * — admins never hit a read-only fallback state.
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const seedingRef = useRef(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, COLLECTION),
      (snap) => {
        if (snap.empty) {
          if (!seedingRef.current) {
            seedingRef.current = true;
            const batch = writeBatch(db);
            SEED_PRODUCTS.forEach((p) => {
              const { id, ...rest } = p;
              const ref = doc(collection(db, COLLECTION));
              batch.set(ref, { ...rest, createdAt: serverTimestamp() });
            });
            batch.commit().catch((err) => {
              console.error("Auto-seed failed:", err);
              seedingRef.current = false;
            });
          }
          // Keep showing the demo list while the real docs write in,
          // so the store never looks empty during the first load.
          setProducts(SEED_PRODUCTS);
        } else {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
          setProducts(list);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firestore products listener error:", err);
        setError(err);
        setProducts(SEED_PRODUCTS);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const addProduct = useCallback(async (product) => {
    return addDoc(collection(db, COLLECTION), {
      ...product,
      createdAt: serverTimestamp(),
    });
  }, []);

  const updateProduct = useCallback(async (id, patch) => {
    return updateDoc(doc(db, COLLECTION, id), patch);
  }, []);

  const deleteProduct = useCallback(async (id) => {
    return deleteDoc(doc(db, COLLECTION, id));
  }, []);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
