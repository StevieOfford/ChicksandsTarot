import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Global variables provided by the Canvas environment or default values for local/deployed.
// These are necessary for Firebase to connect.
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

let app: any;
let db: any;
let auth: any;
let currentUserId: string | null = null;
let isAuthReady: boolean = false;

// Function to initialize Firebase and set up authentication
export const initializeFirebase = async () => {
  if (isAuthReady && app && db && auth) {
    console.log("[Firebase] Already initialized and authenticated.");
    return;
  }

  console.log("[Firebase] Initializing Firebase...");

  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const firebaseConfig = typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : {
        // Provide a bare minimum config for local dev if not running in Canvas
        // For actual deployment, Firebase needs valid config here or via env vars
        apiKey: "YOUR_FIREBASE_API_KEY_FOR_PROD", // Replace with actual Firebase Web API Key for deployed app
        authDomain: "YOUR_FIREBASE_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_FIREBASE_PROJECT_ID",
        storageBucket: "YOUR_FIREBASE_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: appId // Use the runtime appId
      };

  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // Set up auth state listener
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUserId = user.uid;
        console.log("[Firebase] User authenticated:", currentUserId);
      } else {
        currentUserId = null;
        console.log("[Firebase] User unauthenticated.");
      }
      isAuthReady = true;
    });

    // Sign in anonymously or with custom token
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      console.log("[Firebase] Signing in with custom token...");
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      console.log("[Firebase] Signing in anonymously...");
      await signInAnonymously(auth);
    }

    console.log("[Firebase] Firebase initialization complete.");
  } catch (error) {
    console.error("[Firebase] Firebase initialization failed:", error);
    // You might want to display an error message to the user here
  }
};

// Functions to expose Firebase instances and user ID
export const getDb = () => db;
export const getAuthInstance = () => auth; // Renamed to avoid conflict with `auth` variable
export const getUserId = () => currentUserId;
export const getIsAuthReady = () => isAuthReady;

