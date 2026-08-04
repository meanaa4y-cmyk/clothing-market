// Firebase configuration.
// Values are read from environment variables (VITE_FIREBASE_*).
// Copy .env.example to .env and fill in your own Firebase project credentials.
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDNe7LQgwwQRC0GY4XqZQOCSI0NcPJWpPI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'capstone-db-d45e0.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'capstone-db-d45e0',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'capstone-db-d45e0.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '165932300125',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:165932300125:web:f957cd53f455823e7e1ab4'
};
