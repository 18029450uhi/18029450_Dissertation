// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBnzeJ8iq9aVM8rPKSjfblWMpEFZSTEKkE",
    authDomain: "math-question-90677.firebaseapp.com",
    projectId: "math-question-90677",
    storageBucket: "math-question-90677.appspot.com",
    messagingSenderId: "688978502550",
    appId: "1:688978502550:web:9133b727ac7f9786de73b7",
    measurementId: "G-M4ZZKLXCCR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);