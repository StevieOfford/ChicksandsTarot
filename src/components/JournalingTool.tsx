// src/components/JournalingTool.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';

// Ensure these global variables are accessible in the React component context
// @ts-ignore
declare const __app_id: string;
// @ts-ignore
declare const __firebase_config: string;
// @ts-ignore
declare const __initial_auth_token: string;

// ... rest of your JournalingTool.tsx code

// Define the structure for a journal entry
interface JournalEntry {
  id: string;
  userId: string; // To identify the user who created the entry
  title: string;
  content: string;
  timestamp: any; // Firebase Timestamp type
}

const JournalingTool: React.FC = () => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // State to hold the authenticated user ID
  const [isAuthReady, setIsAuthReady] = useState(false); // State to track Firebase auth readiness

  // Initialize Firebase and set up auth listener
  useEffect(() => {
    console.log('[JournalingTool] Initializing Firebase and setting up auth listener...');
    const setupFirebase = async () => {
      try {
        await initializeFirebase();
        console.log('[JournalingTool] Firebase initialized.');
        // Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged(user => {
          if (user) {
            setCurrentUserId(user.uid);
            console.log(`[JournalingTool] User authenticated: ${user.uid}`);
          } else {
            setCurrentUserId(null);
            console.log('[JournalingTool] User not authenticated.');
          }
          setIsAuthReady(true); // Auth state has been checked at least once
        });
        return () => unsubscribe(); // Cleanup auth listener on unmount
      } catch (err) {
        console.error('[JournalingTool] Firebase initialization error:', err);
        setError('Failed to initialize Firebase. Please check your configuration.');
        setIsAuthReady(true);
      }
    };

    setupFirebase();
  }, []); // Run only once on component mount

  // Fetch journal entries when auth state is ready and currentUserId is set
  useEffect(() => {
    if (!isAuthReady || !currentUserId) {
      console.log('[JournalingTool] Not ready to fetch: isAuthReady:', isAuthReady, 'currentUserId:', currentUserId);
      setJournalEntries([]); // Clear entries if not authenticated or ready
      setIsLoading(false);
      return;
    }

    console.log(`[JournalingTool] Fetching journal entries for user: ${currentUserId}`);
    setIsLoading(true);
    setError(null);

    // Define the collection path based on the user's ID
    // __app_id is a global variable provided by the Canvas environment
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const journalCollectionRef = collection(db, `artifacts/${appId}/users/${currentUserId}/journal`);
    const q = query(journalCollectionRef, orderBy('timestamp', 'desc')); // Order by timestamp descending

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries: JournalEntry[] = [];
      snapshot.forEach(doc => {
        entries.push({ id: doc.id, ...doc.data() } as JournalEntry);
      });
      setJournalEntries(entries);
      setIsLoading(false);
      console.log(`[JournalingTool] Fetched ${entries.length} journal entries.`);
    }, (err) => {
      console.error('[JournalingTool] Error fetching journal entries:', err);
      setError('Failed to load journal entries. Please try again.');
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount or when currentUserId changes
  }, [isAuthReady, currentUserId]); // Re-run when auth state or user ID changes

  const handleAddEntry = useCallback(async () => {
    if (!currentUserId) {
      setError('You must be logged in to add journal entries.');
      return;
    }
    if (!newEntryTitle.trim() || !newEntryContent.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }

    setError(null);
    try {
      console.log('[JournalingTool] Adding new journal entry...');
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      await addDoc(collection(db, `artifacts/${appId}/users/${currentUserId}/journal`), {
        title: newEntryTitle,
        content: newEntryContent,
        timestamp: serverTimestamp(), // Use server timestamp for consistency
        userId: currentUserId,
      });
      setNewEntryTitle('');
      setNewEntryContent('');
      console.log('[JournalingTool] Journal entry added successfully.');
    } catch (err) {
      console.error('[JournalingTool] Error adding journal entry:', err);
      setError('Failed to add entry. Please try again.');
    }
  }, [currentUserId, newEntryTitle, newEntryContent]);

  const handleDeleteEntry = useCallback(async (id: string) => {
    if (!currentUserId) {
      setError('You must be logged in to delete journal entries.');
      return;
    }
    setError(null);
    try {
      console.log(`[JournalingTool] Deleting journal entry with ID: ${id}`);
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      await deleteDoc(doc(db, `artifacts/${appId}/users/${currentUserId}/journal`, id));
      console.log(`[JournalingTool] Journal entry ${id} deleted successfully.`);
    } catch (err) {
      console.error('[JournalingTool] Error deleting journal entry:', err);
      setError('Failed to delete entry. Please try again.');
    }
  }, [currentUserId]);

  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Your Spiritual Journal</h2>
      <p className="text-md text-purple-300 mb-6 text-center">
        Record your tarot readings, dream interpretations, spiritual insights, and personal reflections here.
        Your entries are private to you.
      </p>

      {/* User ID Display */}
      {isAuthReady && currentUserId && (
        <div className="bg-purple-800 p-3 rounded-lg mb-6 text-center text-purple-200 text-sm">
          Logged in as: <span className="font-mono text-purple-100 break-all">{currentUserId}</span>
        </div>
      )}
      {isAuthReady && !currentUserId && (
        <div className="bg-red-800 p-3 rounded-lg mb-6 text-center text-red-100 text-sm">
          Not authenticated. Journal entries will not be saved. Please ensure Firebase is configured correctly.
        </div>
      )}


      {error && (
        <div className="bg-red-800 p-4 rounded-lg shadow-inner text-red-100 mb-6">
          <p className="text-lg">{error}</p>
        </div>
      )}

      {/* Add New Entry Form */}
      <div className="mb-10 pb-8 border-b border-purple-700">
        <h3 className="text-2xl font-semibold mb-4 text-purple-200 text-center">Add New Entry</h3>
        <input
          type="text"
          placeholder="Entry Title"
          className="w-full p-3 mb-4 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
          value={newEntryTitle}
          onChange={(e) => setNewEntryTitle(e.target.value)}
          disabled={!currentUserId}
        />
        <textarea
          placeholder="Write your thoughts, readings, or dreams here..."
          className="w-full p-3 mb-4 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg h-32 resize-y"
          value={newEntryContent}
          onChange={(e) => setNewEntryContent(e.target.value)}
          disabled={!currentUserId}
        ></textarea>
        <button
          onClick={handleAddEntry}
          disabled={!currentUserId || !newEntryTitle.trim() || !newEntryContent.trim()}
          className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Journal Entry
        </button>
      </div>

      {/* Journal Entries List */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4 text-purple-200 text-center">Your Entries</h3>
        {isLoading ? (
          <p className="text-center text-purple-300 text-lg">Loading journal entries...</p>
        ) : journalEntries.length === 0 ? (
          <p className="text-center text-purple-300 text-lg">No entries yet. Add your first entry above!</p>
        ) : (
          <div className="space-y-6">
            {journalEntries.map(entry => (
              <div key={entry.id} className="bg-purple-800 p-5 rounded-lg shadow-md border border-purple-700 relative">
                <h4 className="text-xl font-semibold text-purple-100 mb-2">{entry.title}</h4>
                <p className="text-sm text-purple-400 mb-3">
                  {entry.timestamp ? new Date(entry.timestamp.toDate()).toLocaleString() : 'Saving...'}
                </p>
                <p className="text-md text-purple-300 whitespace-pre-wrap leading-relaxed mb-4">{entry.content}</p>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-2xl focus:outline-none"
                  title="Delete Entry"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalingTool;
