// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAjacJPBR56wXK_Q_COGd94HZVwp4mP6Rs",
    authDomain: "minterviewer-e314d.firebaseapp.com",
    projectId: "minterviewer-e314d",
    storageBucket: "minterviewer-e314d.firebasestorage.app",
    messagingSenderId: "318392618925",
    appId: "1:318392618925:web:306d9cbd8355b8081e1b24",
    measurementId: "G-91GYSG8XSD"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);