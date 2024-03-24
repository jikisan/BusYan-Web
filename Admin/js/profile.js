import { getDatabase, get, set, ref, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { convertToPascal } from '/Admin/utils/Utils.js';
import { DBPaths } from '/Admin/js/DB.js';
import { fillUserData } from '/Admin/js/sidebar.js'

const myData = JSON.parse(sessionStorage.getItem('currentUser'));
const db = getDatabase();

const profilePhoto = document.getElementById('profilePhotoId');
const fullName = document.getElementById('profileFullname');
const email = document.getElementById('profileEmail');
const contact = document.getElementById('profileContact');
const oldPassword = document.getElementById('profileOldPassword');
const newPassword = document.getElementById('profileNewPassword');
const confirmPassword = document.getElementById('profileConfirmPassword');

let fileName;
let file;


document.getElementById('updateProfileButton').addEventListener('click', saveProfileInDb);
document.addEventListener('DOMContentLoaded', fillProfile);

window.addEventListener('load', function () {
    document.querySelector('#addProfilePicBtn').addEventListener('change', function (event) {
        if (this.files && this.files[0]) {
            profilePhoto.onload = () => {
                URL.revokeObjectURL(profilePhoto.src);
            }
            profilePhoto.src = URL.createObjectURL(this.files[0]);
            fileName = this.files[0].name;
            file = event.target.files[0];
        }
    });
});

function fillProfile() {

    const imgPlaceHolder = '/Admin/images/profile.png';

    fullName.value = convertToPascal(myData.fullName) || 'Loading...';
    email.value = myData.email || 'Loading...';
    contact.value = myData.phoneNum || 'Loading...';
    profilePhoto.src = myData.imageUrl || imgPlaceHolder;
}

function saveProfileInDb() {
    showLoader();
    uploadProfilePhoto();
}

function uploadProfilePhoto() {
    const ref = firebase.storage().ref(`${DBPaths.ADMIN}`);

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
                console.log(downloadURL);
                updateProfile(downloadURL);
                // Save the downloadURL to your database or use it as needed
            });
        }
    );
}

function updateProfile(url) {
    console.log(myData);

    // Construct data object to send to server
    const data = {
        fullName: fullName.value,
        email: email.value,
        imageUrl: url,
        phoneNum: contact.value
    };

    const id = myData.key;
    const userRef = firebase.database().ref(`${DBPaths.ADMIN}/${id}`);
    userRef.update(data)
    .then(() => {
        myData.key = id;
        myData.fullName = data.fullName;
        myData.email = data.email;
        myData.imageUrl = data.imageUrl;
        myData.phoneNum = data.phoneNum;

        console.log(myData);

        sessionStorage.setItem('currentUser', JSON.stringify(myData));
        fillProfile();
        fillUserData();
        alert('Profile updated!')
    })
    .catch(error => {
        console.error('Error updating multiple fields:', error);
    });
    

    hideLoader();
}

function showLoader() {
    const loader = document.querySelector('.loader-container');
    loader.style.display = 'flex'
}

function hideLoader() {    
    const loader = document.querySelector('.loader-container');
    loader.style.display = "none";
}