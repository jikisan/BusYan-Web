// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, ref, child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { DBPaths } from '/Admin/js/DB.js';
import { convertToPascal } from '/Admin/utils/Utils.js';

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
const auth = getAuth(app);

// Retrieve data from Firebase Realtime Database
const dbRef = ref(getDatabase());

let data; // Declare a global variable to store the data

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         // User is signed in, see docs for a list of available properties
//         const uid = user.uid;

//         get(child(dbRef, `/Passengers/${uid}`))
//         .then((snapshot) => {
//             if (snapshot.exists()) {

//                 data = snapshot.val();

//                 const fullName = data.fullName;
//                 const imageUrl = data.imageUrl;

//                 fillUserData(imageUrl, fullName, '');
//             } else {
//                 alert("No data available");
//             }
//         }).catch((error) => {
//             console.error(error);
//         });
//         // ...
//     } 
//     else {
//         window.location.href = '/login.html'; // Replace "dashboard.html" with the URL of the page you want to redirect to
//     }
// });

document.getElementById('addBusCoopBtn').addEventListener('click', showAddBusCoopModel);

function showAddBusCoopModel() {
    alert('modal');
}

function fillUserData(imageSrc, username, role) {
    
    // Select the elements in the user detail section
    const userDetail = document.querySelector('.user-detail');
    const imgElement = userDetail.querySelector('img');
    const usernameLabel = userDetail.querySelector('label:nth-of-type(1)');
    const roleLabel = userDetail.querySelector('label:nth-of-type(2)');

    // Set the values
    imgElement.src = imageSrc;
    usernameLabel.textContent = convertToPascal(username);
    roleLabel.textContent = 'Admin';
}


