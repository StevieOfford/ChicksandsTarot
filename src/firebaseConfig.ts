// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore, collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, Auth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';

// Define global variables as they are injected by Canvas and used by the app
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string | undefined;

let app: any; // Firebase App instance
export let db: Firestore; // Export db instance
export let auth: Auth; // Export auth instance

// This function initializes Firebase and performs initial authentication
export async function initializeFirebase() {
  console.log('[FirebaseConfig] Initializing Firebase...');
  try {
    const firebaseConfig = JSON.parse(__firebase_config);
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // Initial sign-in (anonymous or custom token)
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      console.log('[FirebaseConfig] Signing in with custom token...');
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      console.log('[FirebaseConfig] Signing in anonymously...');
      await signInAnonymously(auth);
    }
    console.log('[FirebaseConfig] Firebase initialized and authenticated.');
  } catch (error) {
    console.error('[FirebaseConfig] Error initializing Firebase:', error);
    // Propagate error if needed, or handle it
    throw error; // Re-throw to be caught by JournalingTool
  }
}

// Utility function to get the current user ID
export const getUserId = (): string | null => {
  return auth.currentUser ? auth.currentUser.uid : null;
};

// Ensure Firebase is initialized (important for Canvas runtime)
// This pattern ensures the initialization function is called, but is not part of a React lifecycle in App.tsx
// It's more of a global setup.
initializeFirebase().catch(e => console.error("Firebase Init failed globally:", e));
