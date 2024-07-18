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
let UserData = [];

async function fetchUserData() {
    try {
        let response = await fetch(Base_URL + "User.json", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        let data = await response.json();
        // Flatten the structure to extract user data properly
        for (const userId in data) {
            if (data.hasOwnProperty(userId)) {
                for (const key in data[userId]) {
                    if (data[userId].hasOwnProperty(key)) {
                        UserData.push({ id: key, ...data[userId][key] });
                    }
                }
            }
        }
        console.log("UserData loaded:", UserData);
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

async function handleLogin(event) {
    event.preventDefault(); // Prevent the default form submission

    // Fetch the user data before checking login details
    if (UserData.length === 0) {
        await fetchUserData();
    }

    const inputMail = document.getElementById("Login-mail-input").value;
    const inputPassword = document.getElementById("Login-password-input").value;
    let userFound = false;

    for (const user of UserData) {
        console.log(`Checking user: ${user.Email}`);
        if (user.Email === inputMail && user.Password === inputPassword) {
            userFound = true;
            console.log("User found, redirecting...");
            window.location.href = "summaryUser.html"; // Check the path here
            break;
        }
    }

    if (!userFound) {
        alert("Password oder Email ist falsch!");
    }
}

// Fetch user data when the script loads
fetchUserData();

// Add event listener to the form
document.getElementById("loginForm").addEventListener("submit", handleLogin);

