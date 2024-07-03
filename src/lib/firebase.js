import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyALPyJki70mDGIFvIkGmJZAedJsx3PIObo",
  authDomain: "chatapp-ed6f0.firebaseapp.com",
  projectId: "chatapp-ed6f0",
  storageBucket: "chatapp-ed6f0.appspot.com",
  messagingSenderId: "564790589043",
  appId: "1:564790589043:web:b5f72887706a2fc214dc06",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
