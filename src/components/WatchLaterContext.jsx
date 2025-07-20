import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

const WatchLaterContext = createContext();

export const WatchLaterProvider = ({ children }) => {
  const [watchLaterList, setWatchLaterList] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setWatchLaterList([]);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setWatchLaterList(data.watchLater || []);
        } else {
          await setDoc(userDocRef, { watchLater: [] });
        }
      } catch (err) {
        console.error('Failed to load Watch Later list:', err.message);
      }
    });

    return () => unsubscribe();
  }, []);

  const addToWatchLater = async (video) => {
    const user = auth.currentUser;
    if (!user || !video?.id) return;

    const userDocRef = doc(db, 'users', user.uid);

    const exists = watchLaterList.some((v) => v.id === video.id);
    if (!exists) {
      setWatchLaterList((prev) => [...prev, video]);
      try {
        await updateDoc(userDocRef, {
          watchLater: arrayUnion(video),
        });
      } catch (err) {
        console.error('Failed to add to Watch Later:', err.message);
      }
    }
  };

  const removeFromWatchLater = async (id) => {
    const user = auth.currentUser;
    if (!user || !id) return;

    const userDocRef = doc(db, 'users', user.uid);
    const videoToRemove = watchLaterList.find((v) => v.id === id);
    if (!videoToRemove) return;

    setWatchLaterList((prev) => prev.filter((v) => v.id !== id));

    try {
      await updateDoc(userDocRef, {
        watchLater: arrayRemove(videoToRemove),
      });
    } catch (err) {
      console.error('Failed to remove from Watch Later:', err.message);
    }
  };

  return (
    <WatchLaterContext.Provider
      value={{ watchLaterList, addToWatchLater, removeFromWatchLater }}
    >
      {children}
    </WatchLaterContext.Provider>
  );
};

export const useWatchLater = () => useContext(WatchLaterContext);