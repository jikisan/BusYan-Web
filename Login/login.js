import { DBPaths } from '/Admin/js/DB.js';
import firebaseConfig from '/CONFIG.js';

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('password');

document.getElementById('loginMainForm').addEventListener('submit', loginUser);

function loginUser(event) {
    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    const userRef = database.ref(`${DBPaths.ADMIN}`);

    let accountExists = false; // Flag to track if the account exists

    userRef.once('value', (snapshot) => {
        snapshot.forEach((user) => {
            const userKey = user.key;
            const data = user.val();
            const dbEmail = data.email; // Access email from user data
            const dbPassword = data.password; // Access password from user data

            if (username === dbEmail && password == dbPassword) {
              window.location.href = './Admin/admin.html'; // Redirect if credentials match
              accountExists = true; // Set flag to true if account exists
              data["key"] = userKey;
              sessionStorage.setItem('currentUser', JSON.stringify(data));
              return;
            }

            return
        });

        if (!accountExists) {
            alert('Account does not exist');
        }
    });


}

