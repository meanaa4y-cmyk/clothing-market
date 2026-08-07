import { useEffect, useState, useCallback } from "react";
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
 * Falls back to the locally generated demo catalog (from catalog.js)
 * whenever Firestore has no products yet, so the storefront never
 * looks empty before an admin seeds/adds real products.
 */
export function useProducts() {
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, COLLECTION),
      (snap) => {
        if (snap.empty) {
          setProducts(SEED_PRODUCTS);
          setUsingFallback(true);
        } else {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
          setProducts(list);
          setUsingFallback(false);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firestore products listener error:", err);
        setError(err);
        setProducts(SEED_PRODUCTS);
        setUsingFallback(true);
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

  /** Writes the whole local demo catalog into Firestore. Useful once,
   * to give the admin a starting point instead of an empty table. */
  const seedFromDemoCatalog = useCallback(async () => {
    const batch = writeBatch(db);
    SEED_PRODUCTS.forEach((p) => {
      const { id, ...rest } = p;
      const ref = doc(collection(db, COLLECTION));
      batch.set(ref, { ...rest, createdAt: serverTimestamp() });
    });
    await batch.commit();
  }, []);

  return {
    products,
    loading,
    usingFallback,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    seedFromDemoCatalog,
  };
}
