// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDxdnhowTIV9z6Oiq3hLU434jxy29ZB3_k",
  authDomain: "artistsphere-cdab2.firebaseapp.com",
  projectId: "artistsphere-cdab2",
  storageBucket: "artistsphere-cdab2.firebasestorage.app",
  messagingSenderId: "954502962692",
  appId: "1:954502962692:web:79e192edb40cfaafc6df51",
  measurementId: "G-C7P3P3XFP2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
