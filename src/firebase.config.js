// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLNp_ow9eYKy-lxhit6kdALwA1DomLymA",
    authDomain: "ralts-42f1d.firebaseapp.com",
    projectId: "ralts-42f1d",
    storageBucket: "ralts-42f1d.appspot.com",
    messagingSenderId: "504129012003",
    appId: "1:504129012003:web:72860af04a11814e560c96"
};  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };