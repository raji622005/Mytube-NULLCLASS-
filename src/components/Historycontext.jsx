import React, { createContext, useContext, useEffect, useState } from 'react';
import { updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setHistory([]);
        return;
      }

      const historyRef = collection(db, 'users', user.uid, 'history');

      unsubscribeSnapshot = onSnapshot(
        historyRef,
        (snapshot) => {
          const fetched = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHistory(fetched);
        },
        (error) => {
          console.error('Firestore snapshot error:', error.message);
        }
      );
    });

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      unsubscribeAuth();
    };
  }, []);

const addToHistory = async (video) => {
  const user = auth.currentUser;
  if (!user || !video?.id) return;

  try {
    // 1. Save video to history (subcollection under user)
    const videoRef = doc(db, 'users', user.uid, 'history', video.id);
    await setDoc(videoRef, {
      videoId: video.id,
      title: video.title || '',
      thumbnail: video.thumbnail || '',
      channel: video.channel || '',
      watchedAt: serverTimestamp(),
    });

    // 2. Increment user points by 5
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      points: increment(5),
    });

  } catch (err) {
    console.error('Error adding to history:', err.message);
  }
};



  const removeFromHistory = async (id) => {
    const user = auth.currentUser;
    if (!user || !id) return;

    try {
      const videoRef = doc(db, 'users', user.uid, 'history', id);
      await deleteDoc(videoRef);
    } catch (err) {
      console.error('Error removing from history:', err.message);
    }
  };

  const clearHistory = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const historyRef = collection(db, 'users', user.uid, 'history');
      const snapshot = await getDocs(historyRef);
      const deletePromises = snapshot.docs.map((docItem) =>
        deleteDoc(docItem.ref)
      );
      await Promise.all(deletePromises);
    } catch (err) {
      console.error('Error clearing history:', err.message);
    }
  };

  return (
    <HistoryContext.Provider
      value={{ history, addToHistory, removeFromHistory, clearHistory }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);

export const getHistoryOnce = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const historyRef = collection(db, 'users', user.uid, 'history');
    const snapshot = await getDocs(historyRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error('Failed to fetch history once:', err.message);
    return [];
  }
};


