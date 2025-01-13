// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
import {getDatabase} from "firebase/database";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    signInWithRedirect,
    setPersistence,
    browserLocalPersistence,
    onAuthStateChanged
} from 'firebase/auth';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "YOUR_Firebase_KEY",
//     authDomain: "fir-clients-fabb0.firebaseapp.com",
//     databaseURL: "https://fir-clients-fabb0-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "fir-clients-fabb0",
//     storageBucket: "fir-clients-fabb0.firebasestorage.app",
//     messagingSenderId: "458902321381",
//     appId: "1:458902321381:web:23e72c094735fa92373c0c",
//     measurementId: "G-QD4VE5HH5R"
// };

const firebaseConfig = {

    apiKey: "AIzaSyA5E-0JtKm5TkXgHzRokmDunYgQk8a8NAQ",
  
    authDomain: "dissertation-16834.firebaseapp.com",
  
    databaseURL: "https://dissertation-16834-default-rtdb.europe-west1.firebasedatabase.app",
  
    projectId: "dissertation-16834",
  
    storageBucket: "dissertation-16834.firebasestorage.app",
  
    messagingSenderId: "993647303727",
  
    appId: "1:993647303727:web:bfa4aa6c6b16bd83c47ada"
  
  };
    

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// const db = getFirestore(app)
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);
const analytics = getAnalytics(app);

setPersistence(auth, browserLocalPersistence).then(() =>
    console.log('Local persistence set')
).catch((error) =>
    console.error('Error setting local persistence:', error)
);

export {auth, db, provider, signInWithPopup, signOut, onAuthStateChanged};