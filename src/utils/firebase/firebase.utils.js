import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';

import { firebaseConfig } from './firebase.config';

let app;
let db;
let firebaseAvailable = false;

try {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);
  firebaseAvailable = true;
} catch (error) {
  console.warn('Firebase could not be initialized. Running with local data only.', error?.message);
}

export const isFirebaseConfigured = () => firebaseAvailable;

const requireFirebase = () => {
  if (!firebaseAvailable) {
    throw new Error('Firebase is not configured. Add your credentials to a .env file.');
  }
};

// ---------------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------------
export const getProducts = async () => {
  requireFirebase();
  const productsRef = collection(db, 'products');
  const q = query(productsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data()
  }));
};

export const addProduct = async (product) => {
  requireFirebase();
  const productsRef = collection(db, 'products');
  const createdAt = new Date().toISOString();
  const docRef = await addDoc(productsRef, { ...product, createdAt });

  return { id: docRef.id, ...product, createdAt };
};

export const updateProduct = async (productId, updates) => {
  requireFirebase();
  const productDocRef = doc(db, 'products', productId);
  await updateDoc(productDocRef, updates);
};

export const deleteProduct = async (productId) => {
  requireFirebase();
  const productDocRef = doc(db, 'products', productId);
  await deleteDoc(productDocRef);
};

// ---------------------------------------------------------------
// ORDERS
// ---------------------------------------------------------------
export const getOrders = async () => {
  requireFirebase();
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data()
  }));
};

export const addOrder = async (order) => {
  requireFirebase();
  const ordersRef = collection(db, 'orders');
  const createdAt = new Date().toISOString();
  const docRef = await addDoc(ordersRef, { ...order, status: 'pending', createdAt });

  return { id: docRef.id, ...order, status: 'pending', createdAt };
};

export const updateOrderStatus = async (orderId, status) => {
  requireFirebase();
  const orderDocRef = doc(db, 'orders', orderId);
  await updateDoc(orderDocRef, { status });
};

export const deleteOrder = async (orderId) => {
  requireFirebase();
  const orderDocRef = doc(db, 'orders', orderId);
  await deleteDoc(orderDocRef);
};

// ---------------------------------------------------------------
// CATEGORIES (used to seed collections from the old demo data)
// ---------------------------------------------------------------
export const addCollectionAndDocs = async (collectionKey, objectsToAdd) => {
  requireFirebase();
  const collectionRef = collection(db, collectionKey);
  objectsToAdd.forEach(async (category) => {
    const docRef = doc(collectionRef, category.title.toLowerCase());
    await setDoc(docRef, category);
  });
};
