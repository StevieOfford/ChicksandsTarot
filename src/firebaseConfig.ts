// src/firebaseConfig.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';

// Declare global variables injected by the Canvas environment
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let currentUserId: string | null = null;
let authInitializedPromise: Promise<void> | null = null;

// Function to safely get a value from process.env, only if process is defined
const getEnvVar = (key: string): string | undefined => {
  return typeof process !== 'undefined' && process.env ? process.env[key] : undefined;
};

// Centralized Firebase initialization
export const initializeFirebase = async (): Promise<void> => {
  if (authInitializedPromise) {
    return authInitializedPromise; // Return existing promise if already initializing
  }

  authInitializedPromise = new Promise(async (resolve, reject) => {
    try {
      let firebaseConfig: any;

      // Prioritize Canvas injected config for local/Canvas development
      if (typeof __firebase_config !== 'undefined') {
        try {
          firebaseConfig = JSON.parse(__firebase_config);
          console.log('[firebaseConfig] Using Canvas injected Firebase config.');
        } catch (e) {
          console.error('[firebaseConfig] Failed to parse __firebase_config:', e);
          reject(new Error('Invalid Canvas Firebase config.'));
          return;
        }
      } else {
        // For deployed environments (like Amplify), use environment variables
        console.log('[firebaseConfig] Using environment variables for Firebase config.');
        firebaseConfig = {
          apiKey: getEnvVar('REACT_APP_FIREBASE_API_KEY'),
          authDomain: getEnvVar('REACT_APP_FIREBASE_AUTH_DOMAIN'),
          projectId: getEnvVar('REACT_APP_FIREBASE_PROJECT_ID'),
          storageBucket: getEnvVar('REACT_APP_FIREBASE_STORAGE_BUCKET'),
          messagingSenderId: getEnvVar('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
          appId: getEnvVar('REACT_APP_FIREBASE_APP_ID')
        };

        // Basic validation for essential config
        if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
          console.error('[firebaseConfig] Missing essential Firebase environment variables. Please check your Amplify settings.');
          reject(new Error('Essential Firebase config missing from environment variables.'));
          return;
        }
      }

      // Initialize Firebase App
      if (!app) { // Initialize only once
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        console.log('[firebaseConfig] Firebase app and services initialized.');

        // Set up initial authentication state listener
        // This resolves AFTER the auth state is known
        onAuthStateChanged(auth, async (user: User | null) => {
          if (user) {
            currentUserId = user.uid;
            console.log(`[firebaseConfig] onAuthStateChanged: User is logged in as ${currentUserId}`);
          } else {
            // Attempt anonymous sign-in if no user and no custom token is provided
            if (typeof __initial_auth_token === 'undefined') {
              try {
                const anonUserCredential = await signInAnonymously(auth);
                currentUserId = anonUserCredential.user.uid;
                console.log(`[firebaseConfig] onAuthStateChanged: Signed in anonymously as ${currentUserId}`);
              } catch (anonError) {
                console.error('[firebaseConfig] onAuthStateChanged: Anonymous sign-in failed:', anonError);
                currentUserId = null;
              }
            } else {
              // Custom token case (from Canvas)
              try {
                const customToken = await signInWithCustomToken(auth, __initial_auth_token);
                currentUserId = customToken.user.uid;
                console.log(`[firebaseConfig] onAuthStateChanged: Signed in with custom token as ${currentUserId}`);
              } catch (tokenError) {
                console.error('[firebaseConfig] onAuthStateChanged: Custom token sign-in failed:', tokenError);
                currentUserId = null;
              }
            }
          }
          resolve(); // Resolve the promise once auth state is determined
        });
      } else {
        resolve(); // Already initialized
      }
    } catch (error) {
      console.error('[firebaseConfig] Error during initializeFirebase:', error);
      reject(error);
      authInitializedPromise = null; // Allow retry
    }
  });
  return authInitializedPromise;
};

// Export Firestore and Auth instances
export { db, auth };

// Utility to get the current user ID
export const getUserId = (): string => {
  if (!currentUserId) {
    // Fallback or handle case where user ID is not yet available
    console.warn('[firebaseConfig] getUserId called before user ID is available or authenticated.');
    // You might throw an error, return null, or return a temporary ID based on app logic
    return 'anonymous_user_id_pending'; // Placeholder
  }
  return currentUserId;
};
