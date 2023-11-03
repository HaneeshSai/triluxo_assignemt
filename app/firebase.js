// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGG9dnGjd98eAArsNXibzmiG78Kcovsp4",
  authDomain: "todoproject-5050f.firebaseapp.com",
  projectId: "todoproject-5050f",
  storageBucket: "todoproject-5050f.appspot.com",
  messagingSenderId: "722253594385",
  appId: "1:722253594385:web:56370308367e12767316b0",
  measurementId: "G-4DVZ8Q9DB4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase();
export const auth = getAuth();

export default app;
