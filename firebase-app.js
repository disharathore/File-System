// firebase-app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyDGqt9_o3SbDFHo1ah9KY9wJFmrwc4nESk",
  authDomain: "libraryfilesystem.firebaseapp.com",
  projectId: "libraryfilesystem",
  storageBucket: "libraryfilesystem.appspot.com",
  messagingSenderId: "180891186825",
  appId: "1:180891186825:web:208d7a23f7f2fa157b3858"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Add this


export { db, storage };
