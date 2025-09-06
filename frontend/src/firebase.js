// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,  //as we are using vite so insted of proccess.env we use import.meta.env
  authDomain: "neoblog-62548.firebaseapp.com",
  projectId: "neoblog-62548",
  storageBucket: "neoblog-62548.firebasestorage.app",
  messagingSenderId: "422244295494",
  appId: "1:422244295494:web:d84518f0191bb970473b47"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
