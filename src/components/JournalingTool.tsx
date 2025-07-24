import React, { useState, useEffect, useCallback } from 'react';
import { initializeFirebase, db, auth, getUserId } from '../firebaseConfig'; // Import Firebase setup and utils
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'; // Firebase Firestore imports
import { onAuthStateChanged } from 'firebase/auth'; // Firebase Auth for auth state changes

// Declare __app_id as a global variable injected by the Canvas environment
declare const __app_id: string;

interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  timestamp: any; // Firestore Timestamp
}

const JournalingTool: React.FC = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize Firebase and set up auth listener on component mount
  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined;
    let unsubscribeFirestore: (() => void) | undefined;

    const setupFirebase = async () => {
      try {
        console.log('[JournalingTool] Initializing Firebase and setting up auth listener...');
        await initializeFirebase(); // Initialize Firebase
        console.log('[JournalingTool] Firebase initialized.');

        unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
          console.log('[JournalingTool] Auth state changed. User:', user);
          if (user) {
            const currentUserId = getUserId(); // Get the authenticated user ID
            setUserId(currentUserId);
            setIsAuthReady(true);
            console.log(`[JournalingTool] Authenticated. User ID: ${currentUserId}`);

            // Set up Firestore listener *after* auth is ready and user ID is known
            const q = query(
              collection(db, `artifacts/${__app_id}/users/${currentUserId}/journal`),
              orderBy("timestamp", "desc") // Order by timestamp
            );

            unsubscribeFirestore = onSnapshot(q, (snapshot) => {
              const entries: JournalEntry[] = [];
              snapshot.forEach(doc => {
                entries.push({ id: doc.id, ...doc.data() } as JournalEntry);
              });
              setJournalEntries(entries);
              console.log(`[JournalingTool] Fetched ${entries.length} journal entries.`);
            }, (error) => {
              console.error("[JournalingTool] Firestore snapshot error:", error);
              setErrorMessage("Failed to fetch journal entries. Please check console for details.");
            });

          } else {
            setUserId(null);
            setIsAuthReady(true); // Still set ready, even if not authenticated, to allow anonymous sign-in logic to proceed
            setJournalEntries([]);
            console('[JournalingTool] Not authenticated. currentUserId: null');
          }
        });
      } catch (error) {
        console.error('[JournalingTool] Firebase initialization error:', error);
        setErrorMessage('Failed to initialize Firebase. Please check your configuration.');
        setIsAuthReady(false); // Firebase initialization failed
      }
    };

    setupFirebase();

    // Cleanup listeners on unmount
    return () => {
      console.log('[JournalingTool] Cleaning up Firebase listeners...');
      if (unsubscribeAuth) { unsubscribeAuth(); }
      if (unsubscribeFirestore) { unsubscribeFirestore(); }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Check if Firebase is ready before performing operations
  useEffect(() => {
    if (!isAuthReady) {
      console.log(`[JournalingTool] Not ready to fetch: isAuthReady: ${isAuthReady}`);
    }
  }, [isAuthReady]);

  const addOrUpdateEntry = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!userId || !db) {
      setErrorMessage('Not authenticated or Firebase not fully initialized. Journal entries will not be saved. Please ensure Firebase is configured correctly.');
      return;
    }
    if (!newEntryTitle.trim() || !newEntryContent.trim()) {
      setErrorMessage('Title and content cannot be empty.');
      return;
    }

    try {
      if (editingEntryId) {
        // Update existing entry
        await updateDoc(doc(db, `artifacts/${__app_id}/users/${userId}/journal`, editingEntryId), {
          title: newEntryTitle.trim(),
          content: newEntryContent.trim(),
          timestamp: new Date(), // Update timestamp on edit
        });
        setSuccessMessage('Entry updated successfully!');
      } else {
        // Add new entry
        await addDoc(collection(db, `artifacts/${__app_id}/users/${userId}/journal`), {
          title: newEntryTitle.trim(),
          content: newEntryContent.trim(),
          timestamp: new Date(),
          userId: userId, // Store userId for security rules
        });
        setSuccessMessage('Entry added successfully!');
      }
      setNewEntryTitle('');
      setNewEntryContent('');
      setEditingEntryId(null);
    } catch (error) {
      console.error('Error adding/updating entry:', error);
      setErrorMessage('Failed to save entry. Please check console for details.');
    }
  }, [userId, newEntryTitle, newEntryContent, editingEntryId]);

  const editEntry = useCallback((entry: JournalEntry) => {
    setNewEntryTitle(entry.title);
    setNewEntryContent(entry.content);
    setEditingEntryId(entry.id);
    setErrorMessage('');
    setSuccessMessage('');
  }, []);

  const deleteEntry = useCallback(async (entryId: string) => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!userId || !db) {
      setErrorMessage('Not authenticated or Firebase not fully initialized.');
      return;
    }
    // IMPORTANT: Avoid using window.confirm in real apps as it blocks UI. Use a custom modal instead.
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteDoc(doc(db, `artifacts/${__app_id}/users/${userId}/journal`, entryId));
        setSuccessMessage('Entry deleted successfully!');
      } catch (error) {
        console.error('Error deleting entry:', error);
        setErrorMessage('Failed to delete entry. Please check console for details.');
      }
    }
  }, [userId]);


  return (
    <div className="w-full max-w-4xl bg-purple-950 p-6 sm:p-8 rounded-xl shadow-2xl border border-purple-800">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-200">Your Spiritual Journal</h2>
      <p className="text-md text-purple-300 mb-6 text-center">Record your tarot readings, dream interpretations, spiritual insights, and personal reflections here. Your entries are private to you.</p>

      {/* Authentication Status */}
      {!isAuthReady && (
        <div className="bg-orange-800 p-4 rounded-lg shadow-inner text-orange-100 mb-6 text-center">
          <p className="text-lg">Initializing Firebase... Please wait.</p>
        </div>
      )}

      {isAuthReady && !userId && (
        <div className="bg-red-800 p-4 rounded-lg shadow-inner text-red-100 mb-6 text-center">
          <p className="text-lg font-bold">Not authenticated. Journal entries will not be saved. Please ensure Firebase is configured correctly.</p>
          <p className="text-sm text-red-200 mt-2">Attempting anonymous sign-in...</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-800 p-4 rounded-lg shadow-inner text-red-100 mb-6">
          <p className="text-lg">{errorMessage}</p>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-800 p-4 rounded-lg shadow-inner text-green-100 mb-6">
          <p className="text-lg">{successMessage}</p>
        </div>
      )}

      {/* User ID Display */}
      {isAuthReady && userId && (
        <div className="bg-purple-800 p-3 rounded-lg shadow-inner text-purple-200 mb-6 text-center">
          <p className="text-sm">Logged in as: <strong className="text-white">{userId}</strong></p>
        </div>
      )}

      {/* Add/Edit Entry Form */}
      <form onSubmit={addOrUpdateEntry} className="mb-10 p-6 bg-purple-900 rounded-xl border border-purple-700 shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-purple-200">{editingEntryId ? 'Edit Journal Entry' : 'Add New Entry'}</h3>
        <input
          type="text"
          placeholder="Entry Title"
          value={newEntryTitle}
          onChange={(e) => setNewEntryTitle(e.target.value)}
          className="w-full p-3 mb-4 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
          disabled={!isAuthReady}
        />
        <textarea
          placeholder="Write your thoughts, readings, or dreams here..."
          value={newEntryContent}
          onChange={(e) => setNewEntryContent(e.target.value)}
          className="w-full p-3 mb-4 bg-purple-800 text-white rounded-md border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg h-40 resize-y"
          disabled={!isAuthReady}
        ></textarea>
        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg"
            disabled={!isAuthReady || !newEntryTitle.trim() || !newEntryContent.trim()}
          >
            {editingEntryId ? 'Update Entry' : 'Save Entry'}
          </button>
          {editingEntryId && (
            <button
              type="button"
              onClick={() => { setNewEntryTitle(''); setNewEntryContent(''); setEditingEntryId(null); setErrorMessage(''); setSuccessMessage(''); }}
              className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-lg"
              disabled={!isAuthReady}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Journal Entries List */}
      <h3 className="text-2xl font-semibold mb-4 text-purple-200 text-center">My Entries</h3>
      {journalEntries.length === 0 && isAuthReady && (
        <p className="text-lg text-purple-400 text-center">No entries yet. Add your first entry above!</p>
      )}
      <div className="space-y-4">
        {journalEntries.map(entry => (
          <div key={entry.id} className="bg-purple-800 p-4 rounded-lg shadow-md border border-purple-700">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xl font-semibold text-purple-100">{entry.title}</h4>
              <span className="text-sm text-purple-300">
                {entry.timestamp ? new Date(entry.timestamp.toDate()).toLocaleString() : 'N/A'}
              </span>
            </div>
            <p className="text-md text-purple-200 whitespace-pre-wrap mb-3">{entry.content}</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => editEntry(entry)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Edit</button>
              <button onClick={() => deleteEntry(entry.id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default JournalingTool;
