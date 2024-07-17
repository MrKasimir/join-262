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
let loginUserData = [];


async function fetchUserData() {
    try {
        let response = await fetch(Base_URL + "User.json", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        let data = await response.json();
        console.log("Fetched data:", data); // Debugging log

        UserData = []; // Clear UserData before refilling
        loginUserData = []; // Clear loginUserData before refilling

        // Extract email and password for each user and store in loginUserData
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const user = data[key];
                console.log("Processing user:", user); // Debugging log
                if (user.Email && user.Password) {
                    UserData.push({ id: key, ...user });
                    loginUserData.push({ Email: user.Email, Password: user.Password });
                }
            }
        }
        console.log("UserData loaded:", UserData);
        console.log("loginUserData loaded:", loginUserData);
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

function handleLogin() {
    const inputMail = document.getElementById("Login-mail-input").value;
    const inputPassword = document.getElementById("Login-password-input").value;
    let userFound = false;

    console.log("Input Email:", inputMail);
    console.log("Input Password:", inputPassword);

    for (const loginUser of loginUserData) {
        console.log("Checking loginUser:", loginUser);
        if (loginUser.Email === inputMail && loginUser.Password === inputPassword) {
            userFound = true;
            console.log("Match found:", loginUser);
            window.location.href = "summaryUser.html";
            break;
        }
    }

    if (!userFound) {
        alert("Password oder Email ist falsch!");
        console.log("No match found.");
    }
}

// Fetch user data when the script loads
window.onload = fetchUserData;
