// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbuwd1HQRwSnL1BQJUU3889tQunskNBGU",
  authDomain: "senior-project-children-story.firebaseapp.com",
  projectId: "senior-project-children-story",
  storageBucket: "senior-project-children-story.appspot.com",
  messagingSenderId: "22211309396",
  appId: "1:22211309396:web:a300de02106a0b80eca2c1",
  measurementId: "G-C3VFSZ2PDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
const firestore = getFirestore();
export { app, firestore };