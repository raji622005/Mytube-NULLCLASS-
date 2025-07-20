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

const SubscribeContext = createContext();

export const SubscribeProvider = ({ children }) => {
  const [subscribedVideos, setSubscribedVideos] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setSubscribedVideos(data.subscriptions || []);
          } else {
            await setDoc(userDocRef, { subscriptions: [] });
            setSubscribedVideos([]);
          }
        } else {
          setSubscribedVideos([]);
        }
      } catch (err) {
        console.error('Failed to fetch or create user subscriptions:', err.message);
      }
    });

    return () => unsubscribe();
  }, []);

  const subscribeToVideo = async (videoData) => {
    const user = auth.currentUser;
    if (!user) return;

    const { channelId, title, name } = videoData;
    if (!channelId || !title || !name) return;

    const subscription = { channelId, title, name };
    const userDocRef = doc(db, 'users', user.uid);

    const exists = subscribedVideos.some((v) => v.channelId === channelId);
    if (!exists) {
      try {
        setSubscribedVideos((prev) => [...prev, subscription]);
        await updateDoc(userDocRef, {
          subscriptions: arrayUnion(subscription),
        });
      } catch (error) {
        console.error('Error subscribing to channel:', error.message);
      }
    }
  };

  const unsubscribeFromVideo = async (videoData) => {
    const user = auth.currentUser;
    if (!user) return;

    const { channelId, title, name } = videoData;
    if (!channelId || !title || !name) return;

    const subscription = { channelId, title, name };
    const userDocRef = doc(db, 'users', user.uid);

    try {
      setSubscribedVideos((prev) =>
        prev.filter((v) => v.channelId !== channelId)
      );
      await updateDoc(userDocRef, {
        subscriptions: arrayRemove(subscription),
      });
    } catch (error) {
      console.error('Error unsubscribing from channel:', error.message);
    }
  };

  return (
    <SubscribeContext.Provider
      value={{ subscribedVideos, subscribeToVideo, unsubscribeFromVideo }}
    >
      {children}
    </SubscribeContext.Provider>
  );
};

export const useSubscribe = () => useContext(SubscribeContext);
