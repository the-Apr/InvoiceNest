import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCH4ewPQ7sNxPsGhsuvFXS-arsjnZ64-YI",
  authDomain: "invoice-app-58d80.firebaseapp.com",
  projectId: "invoice-app-58d80",
  storageBucket: "invoice-app-58d80.appspot.com",
  messagingSenderId: "416728065726",
  appId: "1:416728065726:web:c07d985701ebda8b41e0ef",
  measurementId: "G-4KD6JMC1ZN"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db } ;

