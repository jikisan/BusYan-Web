// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, ref, child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { DBPaths } from '/Admin/js/DB.js';
import { convertToPascal } from '/Admin/utils/Utils.js';
import firebaseConfig from '/CONFIG.js';


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
document.getElementsByClassName('close')[0].addEventListener('click', hideAddBusCoopModel);
document.getElementById('addBusCoopForm').addEventListener('submit', addBusCoop);


 // Get the modal
 const modal = document.getElementById("myModal");

 function addBusCoop() {
    
 }

 // When the user clicks the button, open the modal 
function showAddBusCoopModel() {
    modal.style.display = "block";
}

 // When the user clicks on <span> (x), close the modal
 function hideAddBusCoopModel() {
    modal.style.display = "none";
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

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

window.addEventListener('load', function () {
    document.querySelector('input[type="file"]').addEventListener('change', function () {
      if (this.files&&this.files[0]) {
        const img = document.getElementById('busCoopImgBtn');
        img.onload = () => {
          URL.revokeObjectURL(img.src);
        }
        img.src = URL.createObjectURL(this.files[0]);
      }
    });
  });

