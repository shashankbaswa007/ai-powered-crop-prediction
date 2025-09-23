import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDm9oLyx7WBYf8tPi2B6CXYYBFLfO_ceEo",
  authDomain: "smart-farmer-ai-ce89a.firebaseapp.com",
  projectId: "smart-farmer-ai-ce89a",
  storageBucket: "smart-farmer-ai-ce89a.firebasestorage.app",
  messagingSenderId: "942315468863",
  appId: "1:942315468863:web:4601c3c89b59113972a08a",
  measurementId: "G-6TSV4DJFTW"
};

// Initialize Firebase
let app;
let auth;
let db;
let analytics;

// Only initialize on client side (not during server-side rendering)
if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Initialize Analytics only if supported (client-side only)
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('🔥 Firebase Analytics initialized!');
      } else {
        console.log('ℹ️ Firebase Analytics not supported in this environment');
      }
    });
    
    console.log('🔥 Firebase connected successfully!');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
} else {
  console.log('🚫 Server-side: Firebase not initialized');
}

export { auth, db, analytics };
export default app;