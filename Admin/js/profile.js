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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbRef = ref(getDatabase());
let data;

document.getElementById('updateProfileButton').addEventListener('click', updateProfile);

function updateProfile() {
    // Fetch input values
    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const contact = document.getElementById('contact').value;
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Construct data object to send to server
    const data = {
        fullName: fullName,
        email: email,
        contact: contact,
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    };

    // Send data to server using AJAX/fetch or any other method
    console.log(data); // Just for demonstration, you would send this data to server
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        const uid = user.uid;

        console.log(DBPaths.PASSENGER);
        get(child(dbRef, `/${DBPaths.PASSENGER}/${uid}`))
        .then((snapshot) => {
            if (snapshot.exists()) {

                data = snapshot.val();
                console.log(data);

                const fullName = data.fullName;
                const email = data.email;
                const contactNum = data.phoneNum;

                fillProfile(fullName, email, contactNum);
            } else {
                alert("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    } 
    else {
        window.location.href = '/login.html'; 
    }
});

function fillProfile(fullName, email, contact){

    document.getElementById('fullname').value = convertToPascal(fullName);
    document.getElementById('email').value = email;
    document.getElementById('contact').value = contact;

}