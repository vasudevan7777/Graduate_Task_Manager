import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSy_placeholder_key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'task-manager-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'task-manager-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'task-manager-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:demo'
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const loginWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    if (error.code === 'auth/invalid-api-key' || error.message?.includes('invalid-api-key')) {
      throw new Error("Invalid or missing Firebase API Key. Please add your real Firebase web configuration keys to .env.local and restart the dev server.");
    }
    throw error;
  }
};

export const logoutUser = async () => {
  return await signOut(auth);
};
