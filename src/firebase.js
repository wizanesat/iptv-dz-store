import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // سطر جديد
const firebaseConfig = {
  apiKey: "AIzaSyAB49VQUvOjjiFnJa5AvxcvNCwXEy9RdL0",
  authDomain: "iptv-dz-store.firebaseapp.com",
  projectId: "iptv-dz-store",
  storageBucket: "iptv-dz-store.firebasestorage.app",
  messagingSenderId: "853009878796",
  appId: "1:853009878796:web:b7dc477a9393a2f67d0329"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // سطر جديد