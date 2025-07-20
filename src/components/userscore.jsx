import React from 'react'
import {  getDoc, setDoc } from "firebase/firestore";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase"; 
export const UserScore = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().points || 0;
  }
  return 0;
};

export const updateUserScore = async (uid, points) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      score: increment(points),
    });
    
  } catch (error) {
    console.error("❌ Error updating score:", error);
  }
};