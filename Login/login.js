 // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, ref, child} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyClxrx1JHZKzdnoQpeGU0xdhSe4Szn9LX0",
    authDomain: "busyan-capstone-3430e.firebaseapp.com",
    databaseURL: "https://busyan-capstone-3430e-default-rtdb.firebaseio.com",
    projectId: "busyan-capstone-3430e",
    storageBucket: "busyan-capstone-3430e.appspot.com",
    messagingSenderId: "513683055597",
    appId: "1:513683055597:web:40dc2ff730a1c6b5b07de4",
    measurementId: "G-NZXE0XTWWH"
};

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase();

const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('password');

document.getElementById('loginMainForm').addEventListener('submit', loginUser);

function loginUser(event) {
    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        const userId = userCredential.user.uid; // Get the user ID

        window.location.href = './Admin/admin.html'; // Replace "dashboard.html" with the URL of the page you want to redirect to


      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle errors like invalid email or password
        console.error(errorCode, errorMessage);
        alert(errorMessage);
      });


}

