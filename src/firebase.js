import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBFrJyxU30349nqUAJqOgVJ93VTBVpdw-c",
  authDomain: "yourtube-2.firebaseapp.com",
  projectId: "yourtube-2",
  storageBucket:  "yourtube-2.firebasestorage.app", 
  messagingSenderId: "747597529649",
  appId: "1:747597529649:web:53d102cfb961cc2c608b10"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
