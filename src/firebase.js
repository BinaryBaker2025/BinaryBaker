import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVS1qlIIayriyluZQIWRnddCRhTYjM3qU",
  authDomain: "binarybaker2025.firebaseapp.com",
  projectId: "binarybaker2025",
  storageBucket: "binarybaker2025.firebasestorage.app",
  messagingSenderId: "895288452460",
  appId: "1:895288452460:web:6ee4fbe8a44dbaded13f49"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
