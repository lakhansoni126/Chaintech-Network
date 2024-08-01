import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyC1jqInt6ylA5NdPzAi60SAwN0j6xUL8tk",
    authDomain: "chaintech-4b7cd.firebaseapp.com",
    projectId: "chaintech-4b7cd",
    storageBucket: "chaintech-4b7cd.appspot.com",
    messagingSenderId: "484994804162",
    appId: "1:484994804162:web:600bdfe66e619e7b4f0e5b"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
