// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
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
const firebaseConfig = {
    apiKey: "YOUR_Firebase_KEY",
    authDomain: "math-question-90677.firebaseapp.com",
    projectId: "math-question-90677",
    storageBucket: "math-question-90677.appspot.com",
    messagingSenderId: "688978502550",
    appId: "1:688978502550:web:9133b727ac7f9786de73b7",
    measurementId: "G-M4ZZKLXCCR"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);
const analytics = getAnalytics(app);

setPersistence(auth, browserLocalPersistence).then(() =>
    console.log('Local persistence set')
).catch((error) =>
    console.error('Error setting local persistence:', error)
);

export {auth, provider, signInWithPopup, signOut, onAuthStateChanged};