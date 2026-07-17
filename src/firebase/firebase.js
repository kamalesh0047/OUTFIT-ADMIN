import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyCLxQCgv2rr_K3qbz8u7PbKVOaq7YTp6qg",
  authDomain: "outfit-ba0ea.firebaseapp.com",
  projectId: "outfit-ba0ea",
  storageBucket: "outfit-ba0ea.firebasestorage.app",
  messagingSenderId: "690800254815",
  appId: "1:690800254815:web:688f4a853208ba9be560ea"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);