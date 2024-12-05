// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGTSjtfdXv5NIgNUIwsY3YNxLvh677Dh0",
  authDomain: "gymbuddy-ff2f1.firebaseapp.com",
  projectId: "gymbuddy-ff2f1",
  storageBucket: "gymbuddy-ff2f1.firebasestorage.app",
  messagingSenderId: "434342779104",
  appId: "1:434342779104:web:c9325c6e05ec5800fc5885",
  measurementId: "G-NL86WH6J3L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db, auth};