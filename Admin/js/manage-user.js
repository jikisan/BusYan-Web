// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, set, ref, child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

import { convertToPascal } from '/Admin/utils/Utils.js';
import { DBPaths } from '/Admin/js/DB.js';
import firebaseConfig from '/CONFIG.js';

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbRef = ref(getDatabase());
const db = getDatabase();

const modal = document.getElementById("myModal");
const coopModal = document.getElementById("coopModal");
const loader = document.querySelector('.loader-container');
const parentDiv = document.querySelector('.bus-coop-container');

const img = document.getElementById('busCoopImgBtn');

const fullnameInput = document.getElementById('coopFullname');
const emailInput = document.getElementById('coopFullEmail');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const phoneNumInput = document.getElementById('phoneNum');

const companyName = document.getElementById('companyName');
const companyAddress = document.getElementById('companyAddress');
const companyDescription = document.getElementById('companyDescription');

let data;
let fileName;
let file;

document.querySelector('.close').addEventListener('click', hideAddBusCoopModal);
document.getElementById('addBusCoopBtn').addEventListener('click', showAddBusCoopModal);
document.querySelector('.coopClose').addEventListener('click', hideCoopModal);
document.getElementById('addBusCoopForm').addEventListener('submit', addBusCoop);

onAuthStateChanged(auth, (user) => {
    if (user) {

        const uid = user.uid;

        get(child(dbRef, `${DBPaths.PASSENGER}/${uid}`))
        .then((snapshot) => {
            if (snapshot.exists()) {

                data = snapshot.val();
                const fullName = data.fullName;
                const imageUrl = data.imageUrl;

                fillUserData(imageUrl, fullName, '');
            }
        })
        .catch((error) => {
            console.error(error);
        });

            getBusCoop();

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


function getBusCoop() {

    const coopRef = database.ref(`${DBPaths.BUS_COOP}`);

    coopRef.once('value', (snapshot) => {
            snapshot.forEach((coop) => {

                const coopKey = coop.key;
                const coopData = coop.val();

                const companyName = coopData.companyName;
                const coopImage = coopData.imgSrc;

                createBusCoopCard(companyName, coopImage, coopKey);
            });


        }
    )
}

function createBusCoopCard(companyName, imageUrl, key) {
    // Create the elements
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('bus-coop-card');

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'bus coop img';

    const nameDiv = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = companyName;
    nameDiv.appendChild(strong);

    // Append elements to the cardDiv
    cardDiv.appendChild(img);
    cardDiv.appendChild(nameDiv);

    cardDiv.addEventListener('click', showCoopModal.bind(null, key));
    
    // Append the cardDiv to the parent div with class bus-coop-container
    parentDiv.appendChild(cardDiv);
}


function showAddBusCoopModal() {
    modal.style.display = "block";
}

function hideAddBusCoopModal() {

    fullnameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";
    phoneNumInput.value = "";

    companyName.value = "";
    companyAddress.value = "";
    companyDescription.value = "";

    modal.style.display = "none";
}

function showCoopModal(key) {
    coopModal.style.display = "block";

    get(child(dbRef, `${DBPaths.BUS_COOP}/${key}`))
        .then((snapshot) => {
            if (snapshot.exists()) {

                let img = document.getElementById('busCoopImg');
                let idElement = document.querySelector('.coop-id').value;
                let fullnameElement = document.querySelector('.coop-fullname').value;
                let emailElement = document.querySelector('.coop-email').value;
                let contactElement = document.querySelector('.coop-contact').value;
                let nameElement = document.querySelector('.coop-name').value;
                let addressElement = document.querySelector('.coop-address').value;
                let descElement = document.querySelector('.coop-desc').value;

                data = snapshot.val();
                console.log(data);

                img.src = data.imgSrc;
                idElement = key;
                // fullnameElement = data.fullname;
                // emailElement = data.email;
                // contactElement = data.phoneNum;
                // nameElement = data.companyName;
                // addressElement = data.companyAddress;
                // descElement = data.companyDescription;

            }
        })
        .catch((error) => {
            console.error(error);
        });
}

function hideCoopModal() {
    coopModal.style.display = "none";
}

function addBusCoop(event) {
    event.preventDefault();

    const isConfirmed = window.confirm("Are you sure all information are correct?");

    if (isConfirmed) {
        saveInDb();
    }

}

function saveInDb() {

    showLoader();
    uploadBusCoopImage();

}

function uploadBusCoopImage() {

    const ref = firebase.storage().ref(`${DBPaths.BUS_COOP}`);

    const metadata = {
        contentType: file.type
    };

    const task = ref.child(fileName).put(file, metadata);

    // Monitor the upload progress
    task.on('state_changed',
        function (snapshot) {
            // Handle progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        },
        function (error) {
            // Handle errors
            console.error('Error uploading file: ', error);
        },
        function () {
            // Handle successful upload
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                createAccount(downloadURL);
                // Save the downloadURL to your database or use it as needed
            });
        }
    );

}

function createAccount(downloadURL) {

    const busCoopData = {
        fullname: fullnameInput.value,
        email: emailInput.value,
        phoneNum: phoneNumInput.value,
        imgSrc: downloadURL,
        companyName: companyName.value,
        companyAddress: companyAddress.value,
        companyDescription: companyDescription.value,
        datetimeAdded: new Date().toISOString()
    };

    console.log(busCoopData);

    createUserWithEmailAndPassword(auth, busCoopData.email, passwordInput.value)
        .then((userCredential) => {
            const userId = userCredential.user.uid;

            const userRef = ref(db, `${DBPaths.BUS_COOP}/${userId}`);
            set(userRef, busCoopData);

            parentDiv.innerHTML = ''
            getBusCoop();
            hideAddBusCoopModal();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // Handle errors like invalid email or password
            alert(`${errorMessage}`);
        }
        );

    hideLoader();
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
    document.querySelector('input[type="file"]').addEventListener('change', function (event) {
        if (this.files && this.files[0]) {
            img.onload = () => {
                URL.revokeObjectURL(img.src);
            }
            img.src = URL.createObjectURL(this.files[0]);
            fileName = this.files[0].name;
            file = event.target.files[0];
        }
    });
});

// Function to validate form inputs
function busCoopLoginDetailsIsValid() {
    let isValid = true;

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
        isValid = false;
        alert('Please enter a valid email address');
        return isValid;
    }

    // Validate Password
    if (passwordInput.value.trim().length < 8) {
        isValid = false;
        alert('Password must be at least 6 characters long');
        return isValid;
    }

    // Validate Confirm Password
    if (confirmPasswordInput.value.trim() !== passwordInput.value.trim()) {
        isValid = false;
        alert('Passwords do not match');
        return isValid;
    }

    // Validate Phone Number
    const phoneNumPattern = /^\d{11}$/; // Assuming phone number is 10 digits
    if (!phoneNumPattern.test(phoneNumInput.value.trim())) {
        isValid = false;
        alert('Please enter a valid 10-digit phone number');
        return isValid;
    }

    return isValid;
}
