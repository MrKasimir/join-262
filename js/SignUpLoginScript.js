const Base_URL = "https://join-262-default-rtdb.europe-west1.firebasedatabase.app/";
// SIGNUP
let Contacts = [];

async function fetchHighestUserID() {
    try {
        let response = await fetch(Base_URL + "User.json", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        let responsetoJson = await response.json();
        let highestID = 0;
        for (let key in responsetoJson) {
            let userID = parseInt(key.replace('UserID_', ''));
            if (userID > highestID) {
                highestID = userID;
            }
        }
        return highestID;
    } catch (error) {
        console.error("Error fetching highest UserID:", error);
    }
}

async function postData(path = "User/User(collection)", data = {}) {
    try {
        let response = await fetch(Base_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        let responsetoJson = await response.json();
        return responsetoJson;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function onSignUp(userData) {
    try {
        let highestID = await fetchHighestUserID();
        let newUserID = `UserID_${highestID + 1}`;
        let response = await postData(`User/${newUserID}`, userData);
        console.log("User created:", response);
        pushToLocalArray(userData); // Push user data to local Contacts array
        // Clear the inputs after the user has been created
    } catch (error) {
        console.error("Error in onSignUp:", error);
    }
}

function pushToLocalArray(userData) {
    Contacts.push(userData);
    console.log("Current Contacts Array:", Contacts);
}

function SignUpButtonOnClick(event) {
    event.preventDefault(); // Prevent form from submitting

    const Name = document.getElementById('SignUp-Name').value.trim();
    const Email = document.getElementById('SignUp-Email').value.trim();
    const Password = document.getElementById('SignUp-Password').value.trim();
    const confirmPassword = document.getElementById('SignUp-ConfirmPassword').value.trim();

    if (Name && Email && Password && confirmPassword) {
        checkPassword(Password, confirmPassword, { Name, Email, Password });
    } else {
        alert("All fields are required!");
    }
}

function checkPassword(Password, confirmPassword, userData) {
    if (Password === confirmPassword) {
        onSignUp(userData);
    } else {
        alert("Passwords do not match!");
    }
}

// LOGIN //
function onload(){
    loadData();
}

// Function to load data from Firebase
async function loadData() {
    try {
        console.log("Fetching data from:", Base_URL + "User.json"); // Log URL
        let response = await fetch(Base_URL + "User.json", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log("Response status:", response.status); // Log response status

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        console.log("Data fetched successfully:", data); // Log fetched data
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

// Function to compare user input with loaded user data
async function compareUserDataForLogin() {
    const emailInput = document.getElementById('Login-mail-input').value.trim();
    const passwordInput = document.getElementById('Login-password-input').value.trim();

    if (!emailInput || !passwordInput) {
        alert("Email and password are required!");
        return;
    }

    try {
        const users = await loadData();
        let userFound = false;

        for (let userId in users) {
            const user = users[userId];
            const UserEmail = user.Email;
            const UserPassword = user.Password;

            if (UserEmail === emailInput && UserPassword === passwordInput) {
                userFound = true;
                console.log("Login successful");

                // Redirect to summaryUser.html after successful login
                window.location.href = "summaryUser.html";
                break;
            }
        }

        if (!userFound) {
            alert("Email or password is incorrect");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error loading user data");
    }
}

// Dummy function for guest login
function guestLogin() {
    alert("Guest login feature not implemented.");
}
