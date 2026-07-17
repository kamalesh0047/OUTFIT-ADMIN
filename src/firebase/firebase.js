import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCLxQCgv2rr_K3qbz8u7PbKVOaq7YTp6qg",
  authDomain: "outfit-ba0ea.firebaseapp.com",
  projectId: "outfit-ba0ea",
  storageBucket: "outfit-ba0ea.firebasestorage.app",
  messagingSenderId: "690800254815",
  appId: "1:690800254815:web:688f4a853208ba9be560ea"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Keep users signed in even after closing the browser
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence enabled");
  })
  .catch((error) => {
    console.error("Persistence error:", error);
  });

export const db = getFirestore(app);

// Cloud Functions live in asia-south1 (Mumbai) — must match functions/index.js
export const functions = getFunctions(app, "asia-south1");

export default app;