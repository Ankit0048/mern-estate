// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-dbdb4.firebaseapp.com",
  projectId: "mern-estate-dbdb4",
  storageBucket: "mern-estate-dbdb4.appspot.com",
  messagingSenderId: "724538011485",
  appId: "1:724538011485:web:24d2e3d8ee9809e96382b4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);