// Dynamically loads the Firebase compat SDK scripts (once) and initializes the app.
// Both Client and Admin pages call this so they share the same live Firestore backend.
import { FIREBASE_CONFIG } from './firebaseConfig';

let loadingPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export function loadFirebase() {
  if (loadingPromise) return loadingPromise;
  loadingPromise = (async () => {
    await loadScript('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
    await loadScript('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore-compat.js');
    window.FIREBASE_CONFIG = FIREBASE_CONFIG;
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(FIREBASE_CONFIG);
    }
    return window.firebase.firestore();
  })();
  return loadingPromise;
}
