 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
 import { getDatabase, get, ref, child} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
 import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
 
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

 
document.getElementById('logoutBtn').addEventListener('click', confirmLogout);

function logoutUser() {
    signOut(auth)
      .then(() => {
        // Redirect the user to the login page or any other page after logout
        window.location.href = "/login.html"; 
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        // Handle any errors that occur during logout
        alert("Error logging out. Please try again.");
      });
}

function confirmLogout() {
    // Display a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    
    if (isConfirmed) {
        // If the user confirms, call the logoutUser function to log out
        logoutUser();
    }
}