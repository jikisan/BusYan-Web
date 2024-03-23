// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, ref, child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { convertToPascal } from '/Admin/utils/Utils.js';
import firebaseConfig from '/CONFIG.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbRef = ref(getDatabase());
const modal = document.getElementById("myModal");
const loader = document.querySelector('.loader-container');

const img = document.getElementById('busCoopImgBtn');
const companyName = document.getElementById('companyName');
const companyAddress = document.getElementById('companyAddress');
const companyDescription = document.getElementById('companyDescription');

let data; 

document.getElementsByClassName('close')[0].addEventListener('click', hideAddBusCoopModal);
document.getElementById('addBusCoopBtn').addEventListener('click', showAddBusCoopModal);
document.getElementById('addBusCoopForm').addEventListener('submit', addBusCoop);

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        const uid = user.uid;

        get(child(dbRef, `/Passengers/${uid}`))
            .then((snapshot) => {
                if (snapshot.exists()) {

                    data = snapshot.val();

                    const fullName = data.fullName;
                    const imageUrl = data.imageUrl;

                    fillUserData(imageUrl, fullName, '');
                } else {
                    alert("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        // ...
    }
    else {
        window.location.href = '/login.html'; // Replace "dashboard.html" with the URL of the page you want to redirect to
    }
});

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

function showAddBusCoopModal() {
    modal.style.display = "block";
}

function hideAddBusCoopModal() {
    // img.src = '/Admin/images/upload_company_picture.png'
    companyName.value = "";
    companyAddress.value = "";
    companyDescription.value = "";
    modal.style.display = "none";
}

function addBusCoop(event) {
    event.preventDefault();
    hideAddBusCoopModal();
    showLoader();
}

function showLoader() {
    loader.style.display = 'flex'
}

function hideLoader() {
    loader.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

window.addEventListener('load', function () {
    document.querySelector('input[type="file"]').addEventListener('change', function () {
        if (this.files && this.files[0]) {
            img.onload = () => {
                URL.revokeObjectURL(img.src);
            }
            img.src = URL.createObjectURL(this.files[0]);
        }
    });
});

