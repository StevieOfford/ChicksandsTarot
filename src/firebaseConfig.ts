// @ts-ignore
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Declare global variables provided by the Canvas environment
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let userId: string | null = null; // To store the current user ID

// Function to initialize Firebase and handle authentication
const initializeFirebase = async () => {
  if (app) {
    console.log('[Firebase Config] Firebase already initialized.');
    return; // Already initialized
  }

  try {
    console.log('[Firebase Config] Attempting to initialize Firebase...');
    const firebaseConfig = typeof __firebase_config !== 'undefined'
      ? JSON.parse(__firebase_config)
      : {};

    // __app_id is provided by the Canvas environment
    const appId = typeof __app_id !== 'undefined'
      ? __app_id
      : 'default-app-id'; // Fallback for local development or if not provided

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    console.log('[Firebase Config] Firebase app initialized. Attempting authentication...');

    // Sign in with custom token if available, otherwise anonymously
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      console.log('[Firebase Config] Signing in with custom token...');
      await signInWithCustomToken(auth, __initial_auth_token);
      console.log('[Firebase Config] Signed in with custom token.');
    } else {
      console.log('[Firebase Config] No custom token found, signing in anonymously...');
      await signInAnonymously(auth);
      console.log('[Firebase Config] Signed in anonymously.');
    }

    // Set the userId after successful authentication
    userId = auth.currentUser?.uid || crypto.randomUUID();
    console.log(`[Firebase Config] Current User ID: ${userId}`);

  } catch (error) {
    console.error('[Firebase Config] Error during Firebase initialization or authentication:', error);
    // Fallback to anonymous sign-in if custom token fails, or generate a random ID if even anonymous fails
    if (!auth || !auth.currentUser) {
      console.warn('[Firebase Config] Could not authenticate. Generating a random user ID.');
      userId = crypto.randomUUID();
    }
    throw error; // Re-throw to propagate the error to the calling component
  }
};

// Function to get the current user ID
const getUserId = () => {
  return userId;
};

export { db, auth, initializeFirebase, getUserId };
