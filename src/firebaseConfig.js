import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD70eAPercei20Skh1or9MF77PIR2yuJIs",
  authDomain: "udaan-lothinkers.firebaseapp.com",
  projectId: "udaan-lothinkers",
  storageBucket: "udaan-lothinkers.firebasestorage.app",
  messagingSenderId: "udaan-lothinkers.firebasestorage.app",
  appId: "1:736914644010:web:cf06f2bf2427f66510b753"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);