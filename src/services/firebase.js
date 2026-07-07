import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjv24IfowNpSai2VvJXaE2bMKFZbbHkQ8",
  authDomain: "resortflow-bc8b6.firebaseapp.com",
  projectId: "resortflow-bc8b6",
  storageBucket: "resortflow-bc8b6.firebasestorage.app",
  messagingSenderId: "759796707945",
  appId: "1:759796707945:web:933615bc2459db26e7a8f8",
  measurementId: "G-WTRQM6PW3K",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
