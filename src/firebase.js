import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFcG6VRlkes7PUsR3xHT-WohruorKJIZw",
  authDomain: "first-jp.firebaseapp.com",
  projectId: "first-jp",
  storageBucket: "first-jp.appspot.com",
  messagingSenderId: "1018006324961",
  appId: "1:1018006324961:web:72782c28c1e7d0942e19a0",
  measurementId: "G-G578E0DGFR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };