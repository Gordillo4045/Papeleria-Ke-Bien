// // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 import { getAuth } from "firebase/auth";
 import { getFirestore } from "firebase/firestore";
 import { getStorage } from "firebase/storage";
 import { getDatabase} from 'firebase/database';
 

// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYVw3JjJ8sfNxD0aCwbT255HAoMjTt4yY",
  authDomain: "papeleria-ke-bien.firebaseapp.com",
  projectId: "papeleria-ke-bien",
  storageBucket: "papeleria-ke-bien.appspot.com",
  messagingSenderId: "305276929315",
  appId: "1:305276929315:web:12a17752ef3f9932bc7896",
  measurementId: "G-FJVB30V5P3"
};

// // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const database = getDatabase();

  export {auth,db,storage, database}
// const analytics = getAnalytics(app);
