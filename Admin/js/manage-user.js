// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, set, ref, child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

import { convertToPascal, getCurrentDateTimeInMillis } from '/Admin/utils/Utils.js';
import { DBPaths } from '/Admin/js/DB.js';
import firebaseConfig from '/CONFIG.js';

const database = firebase.database();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbRef = ref(getDatabase());
const db = getDatabase();

const myData = JSON.parse(sessionStorage.getItem('currentUser'));

const modal = document.getElementById("myModal");
const coopModal = document.getElementById("coopModal");
const loader = document.querySelector('.loader-container');
const parentDiv = document.querySelector('.bus-coop-container');

const busCoopUserPhoto = document.getElementById('busCoopUserPhoto');
const busCoopUserPhotoBtn = document.getElementById('busCoopUserPhotoBtn');

const img = document.getElementById('busCoopImgBtn');
const addCoopPhotoBtn = document.getElementById('addCoopPhotoBtn');


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
let fileNameUserPhoto;
let file;
let fileUserPhoto;
let busCoopArray = [];
let action;
let currentCoop;

document.getElementById('addBusCoopBtn').addEventListener('click', addBusCoop);
document.getElementById('addBusCoopForm').addEventListener('submit', saveBusCoopInDb);
document.querySelector('.close').addEventListener('click', hideAddBusCoopModal);
document.getElementById('deleteCoopBtn').addEventListener('click', deleteBusCoop);
document.getElementById('editCoopBtn').addEventListener('click', editBusCoop);
document.getElementById('searchInput').addEventListener('input', handleSearchInput);
document.querySelector('.coopClose').addEventListener('click', hideCoopModal);

document.addEventListener('DOMContentLoaded', getBusCoop);

function getBusCoop() {

    const busCoopContainer = document.querySelector('.bus-coop-container');
    busCoopContainer.innerHTML = "";
    busCoopArray = [];
    showLoader();

    const coopRef = database.ref(`${DBPaths.BUS_COOP}`);

    coopRef.once('value',
        (snapshot) => {
            snapshot.forEach((coop) => {

                const coopKey = coop.key;
                const coopData = coop.val();
                coopData["key"] = coopKey;
                busCoopArray.push(coopData);

                const companyName = coopData.companyName;
                const coopImage = coopData.imgUrl;

                createBusCoopCard(companyName, coopImage, coopKey);
            });

            hideLoader();

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

function addBusCoop() {
    action = "add";
    img.src = "/Admin/images/upload_company_picture.png"; // Reset bus cooperative image
    busCoopUserPhoto.src = "/Admin/images/profile.png";  // Reset user photo

    // Clear text input fields
    fullnameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";
    phoneNumInput.value = "";

    // Clear company-related fields
    companyName.value = "";
    companyAddress.value = "";
    companyDescription.value = "";
    showAddBusCoopModal();
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

                data = snapshot.val();
                const key = snapshot.key;
                data["key"] = key;
                currentCoop = data;
                const fullName = convertToPascal(data.fullName);

                document.getElementById('busUserCoopImg').src = data.userImgSrc;;
                document.getElementById('coopId').textContent = key;
                document.getElementById('coopFullnameSpan').textContent = fullName;
                document.getElementById('coopEmail').textContent = data.email;
                document.getElementById('coopContact').textContent = data.phoneNum;

                document.getElementById('busCoopImg').src = data.imgUrl;;
                document.getElementById('coopName').textContent = data.companyName;
                document.getElementById('coopAddress').textContent = data.companyAddress;
                document.getElementById('coopDesc').textContent = data.companyDescription;
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

function hideCoopModal() {
    coopModal.style.display = "none";
}

function saveBusCoopInDb(event) {
    event.preventDefault();


    const isConfirmed = window.confirm("Are you sure all information are correct?");

    if (isConfirmed) {
        if (busCoopLoginDetailsIsValid()) {

            showLoader();

            switch (action) {
                case "add":
                    showLoader();
                    uploadBusCoopImage();
                    break;
                case "edit":
                    validateImages();
                    break;
            }

        }
    }

    hideLoader();

}

function validateImages() {

    const addCoopPhotoBtnIsEmpty = addCoopPhotoBtn.files.length === 0 || addCoopPhotoBtn.value === '';
    const busCoopUserPhotoBtnIsEmpty = busCoopUserPhotoBtn.files.length === 0 || busCoopUserPhotoBtn.value === '';


    if (addCoopPhotoBtnIsEmpty && busCoopUserPhotoBtnIsEmpty) {

        console.log("no photos")
        updateCoop();
    }
    else if (!addCoopPhotoBtnIsEmpty && busCoopUserPhotoBtnIsEmpty) {
        console.log("with bus coop photo")
        uploadBusCoopImage();
    }
    else if (!busCoopUserPhotoBtnIsEmpty) {
        uploadBusCoopUserImageEdit();
    }

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
            console.log('Upload bus coop photo is ' + progress + '% done');
        },
        function (error) {
            // Handle errors
            console.error('Error uploading file: ', error);
        },
        function () {
            // Handle successful upload
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {

                switch (action) {
                    case "add":
                        updateCoop();
                        break;
                    case "edit":
                        if (busCoopUserPhotoBtn && (busCoopUserPhotoBtn.files.length === 0 || busCoopUserPhotoBtn.value === '')) {
                            updateCoop(downloadURL, currentCoop.userImgSrc);
                        }
                        else {
                            uploadBusCoopUserImage(downloadURL);
                        }
                        break;
                }

            });
        }
    );

}

function uploadBusCoopUserImage(busCoopImageUrl) {
    const ref = firebase.storage().ref(`${DBPaths.BUS_COOP}`);

    const metadata = {
        contentType: file.type
    };

    const task = ref.child(fileNameUserPhoto).put(fileUserPhoto, metadata);

    // Monitor the upload progress
    task.on('state_changed',
        function (snapshot) {
            // Handle progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload user photo is ' + progress + '% done');
        },
        function (error) {
            // Handle errors
            console.error('Error uploading file: ', error);
        },
        function () {
            // Handle successful upload
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {

                switch (action) {
                    case "add":
                        createAccount(busCoopImageUrl, downloadURL);
                        break;
                    case "edit":
                        updateCoop(currentCoop.imgUrl, downloadURL);
                        break;
                }
            });
        }
    );
}

function uploadBusCoopUserImageEdit() {
    const ref = firebase.storage().ref(`${DBPaths.BUS_COOP}`);

    const metadata = {
        contentType: fileUserPhoto.type
    };

    const task = ref.child(fileNameUserPhoto).put(fileUserPhoto, metadata);

    // Monitor the upload progress
    task.on('state_changed',
        function (snapshot) {
            // Handle progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload user photo is ' + progress + '% done');
        },
        function (error) {
            // Handle errors
            console.error('Error uploading file: ', error);
        },
        function () {
            // Handle successful upload
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {

                updateCoop(currentCoop.imgUrl, downloadURL);

            });
        }
    );
}

function updateCoop(busCoopImageUrl, busCoopUserImageUrl) {
    const busCoopData = {
        fullName: fullnameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        imgUrl: busCoopImageUrl,
        userImgSrc: busCoopUserImageUrl,
        phoneNum: phoneNumInput.value,
        companyName: companyName.value,
        companyAddress: companyAddress.value,
        companyDescription: companyDescription.value,
    };

    const userRef = firebase.database().ref(`${DBPaths.BUS_COOP}/${currentCoop.key}`);
    userRef.update(busCoopData)
        .then(() => {
            hideAddBusCoopModal();
            getBusCoop();
        })
        .catch(error => {
            console.error('Error updating multiple fields:', error);
        });

    hideLoader();
}

function createAccount(busCoopImageUrl, busCoopUserImageUrl) {

    const busCoopData = {
        fullName: fullnameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        phoneNum: phoneNumInput.value,
        imgUrl: busCoopImageUrl,
        userImgSrc: busCoopUserImageUrl,
        companyName: companyName.value,
        companyAddress: companyAddress.value,
        companyDescription: companyDescription.value,
        createdBy: myData.key,
        datetimeAdded: new Date().toISOString()
    };

    const id = getCurrentDateTimeInMillis();
    const userRef = ref(db, `${DBPaths.BUS_COOP}/${id}`);
    set(userRef, busCoopData)
        .then(() => {
            hideAddBusCoopModal();
            getBusCoop();
        })
        .catch(error => {
            // An error occurred while setting data
            console.error('Error setting data:', error);
        });



    hideLoader();
}

function showLoader() {
    loader.style.display = 'flex'
}

function hideLoader() {
    setTimeout(function () {
        loader.style.display = "none";
    }, 2000); // 3000 milliseconds = 3 seconds
}

function deleteBusCoop() {

    const isConfirmed = window.confirm("Are you sure you want to remove this account?");

    if (isConfirmed) {
        const key = document.getElementById('coopId').textContent;
        const dbRef = firebase.database().ref(`${DBPaths.BUS_COOP}/${key}`);

        dbRef.remove()
            .then(() => {
                console.log('User data deleted successfully.');
                signInWithEmailAndPassword
                getBusCoop();
                hideCoopModal();

            })
            .catch((error) => {
                console.error('Error deleting user data:', error);
            });
    }


}

function editBusCoop() {
    action = "edit";
    hideCoopModal();
    busCoopUserPhoto.src = currentCoop.userImgSrc; // Reset bus cooperative image
    img.src = currentCoop.imgUrl;  // Reset user photo

    // Clear text input fields
    fullnameInput.value = currentCoop.fullName;
    emailInput.value = currentCoop.email;
    passwordInput.value = currentCoop.password;
    confirmPasswordInput.value = currentCoop.password;
    phoneNumInput.value = currentCoop.phoneNum;

    // Clear company-related fields
    companyName.value = currentCoop.companyName;
    companyAddress.value = currentCoop.companyAddress;
    companyDescription.value = currentCoop.companyDescription;
    showAddBusCoopModal();
}

function handleSearchInput() {

    const busCoopContainer = document.querySelector('.bus-coop-container');
    busCoopContainer.innerHTML = "";

    const searchInput = document.getElementById("searchInput");
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Filter data based on search term
    const results = busCoopArray.filter(item => item.companyName.toLowerCase().includes(searchTerm));
    // Render search results
    renderResults(results);
}

function renderResults(results) {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    console.log(results);

    results.forEach(result => {

        const companyName = result.companyName;
        const coopImage = result.imgSrc;
        const key = result.key;

        createBusCoopCard(companyName, coopImage, key);
    });
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

window.addEventListener('load', function () {
    document.querySelector('#addCoopPhotoBtn').addEventListener('change', function (event) {
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

window.addEventListener('load', function () {
    document.querySelector('#busCoopUserPhotoBtn').addEventListener('change', function (event) {
        if (this.files && this.files[0]) {
            busCoopUserPhoto.onload = () => {
                URL.revokeObjectURL(busCoopUserPhoto.src);
            }
            busCoopUserPhoto.src = URL.createObjectURL(this.files[0]);
            fileNameUserPhoto = this.files[0].name;
            fileUserPhoto = event.target.files[0];
        }
    });
});

// Function to validate form inputs
function busCoopLoginDetailsIsValid() {
    // Check if bus cooperative photo is different from the placeholder image
    const busCoopImgNotValid = img.src.includes('/Admin/images/upload_company_picture.png');

    // Check if user photo is different from the placeholder image
    const busCoopUserPhotoNotValid = busCoopUserPhoto.src.includes('/Admin//images/profile.png');

    // Validate Email
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());

    // Validate Password
    const passwordValid = passwordInput.value.trim().length >= 8;

    // Validate Confirm Password
    const confirmPasswordValid = confirmPasswordInput.value.trim() === passwordInput.value.trim();

    // Validate Phone Number
    const phoneNumValid = /^\d{11}$/.test(phoneNumInput.value.trim());

    if (busCoopImgNotValid) {
        alert('Please select a bus cooperative photo');
        return false;
    }

    if (busCoopUserPhotoNotValid) {
        alert('Please select a user photo');
        return false;
    }

    if (!emailValid) {
        alert('Please enter a valid email address');
        return false;
    }

    if (!passwordValid) {
        alert('Password must be at least 8 characters long');
        return false;
    }

    if (!confirmPasswordValid) {
        alert('Passwords do not match');
        return false;
    }

    if (!phoneNumValid) {
        alert('Please enter a valid 11-digit phone number');
        return false;
    }

    return true;
}


