// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnJ1j1o4EpACAI8rKNPZCX6AfZhlT9_sE",
  authDomain: "chatgpt-2025-256de.firebaseapp.com",
  projectId: "chatgpt-2025-256de",
  storageBucket: "chatgpt-2025-256de.firebasestorage.app",
  messagingSenderId: "308265406117",
  appId: "1:308265406117:web:96a5f24b4e6355e616c74c",
  measurementId: "G-W94HWPF1FR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);