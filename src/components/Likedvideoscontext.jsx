
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

const LikedVideosContext = createContext();

export const LikedVideosProvider = ({ children }) => {
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setLikedVideos(data.likedVideos || []);
      } else {
        await setDoc(userDocRef, { likedVideos: [] });
      }
    };

    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchLikedVideos();
    });

    return () => unsubscribe();
  }, []);
const addToLikedVideos = async (video) => {
  const user = auth.currentUser;
  if (!user || !video?.id) return;

  const userDocRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    await setDoc(userDocRef, { likedVideos: [video] });
    setLikedVideos([video]);
    return;
  }

  const data = docSnap.data();
  const alreadyExists = data?.likedVideos?.some((v) => v.id === video.id);
  if (alreadyExists) return;

  setLikedVideos((prev) => [...prev, video]);
  await updateDoc(userDocRef, {
    likedVideos: arrayUnion(video),
  });
};



  const removeFromLikedVideos = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    const videoToRemove = likedVideos.find((v) => v.id === id);
    if (!videoToRemove) return;

    const userDocRef = doc(db, 'users', user.uid);
    setLikedVideos((prev) => prev.filter((v) => v.id !== id));

    await updateDoc(userDocRef, {
      likedVideos: arrayRemove(videoToRemove),
    });
  };

  return (
    <LikedVideosContext.Provider
      value={{ likedVideos, addToLikedVideos, removeFromLikedVideos }}
    >
      {children}
    </LikedVideosContext.Provider>
  );
};

export const useLikedVideos = () => useContext(LikedVideosContext);
