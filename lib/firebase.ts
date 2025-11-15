// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDy_IhzHfEIPIkLhFp8gEHNvxy3309ngf0",
//   authDomain: "minterviewer-notifications.firebaseapp.com",
//   projectId: "minterviewer-notifications",
//   storageBucket: "minterviewer-notifications.firebasestorage.app",
//   messagingSenderId: "474639355603",
//   appId: "1:474639355603:web:b7cbfbb4d760cdf40fce26",
//   measurementId: "G-XQ99R6J3NF"
// };

// const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);




// firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDy_IhzHfEIPIkLhFp8gEHNvxy3309ngf0",
  authDomain: "minterviewer-notifications.firebaseapp.com",
  projectId: "minterviewer-notifications",
  storageBucket: "minterviewer-notifications.firebasestorage.app",
  messagingSenderId: "474639355603",
  appId: "1:474639355603:web:b7cbfbb4d760cdf40fce26",
  measurementId: "G-XQ99R6J3NF",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

export default app;

