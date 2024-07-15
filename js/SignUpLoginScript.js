const Base_URL = "https://join-262-default-rtdb.europe-west1.firebasedatabase.app/";

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

async function postData(path = "User/User(collection)", data = {}) { // function to push data 
    try {
        let response = await fetch(Base_URL + path + ".json", {
            method: "POST", // method can be changed to "PUT", "DELETE", "PATCH" ,"GET"
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
        postData(`User/${newUserID}`, userData)
            .then(response => console.log("User created:", response))
            .catch(error => console.error("Error creating user:", error));
    } catch (error) {
        console.error("Error in onSignUp:", error);
    }
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

// Call this function on page load
function onload() {
   // Load initial data if needed
    loadData().then(responsetoJson => {
        console.log(responsetoJson);
    });
}

     // Login ´
    /*
     
     function onload(){
      
        console.log(responsetoJson);
     }

     async function loadData(path="User_ID"){ // funktion um daten von firebase zu laden 
        let response = await fetch(Base_URL + path +".json");
        let responsetoJson =  await response.json();
        console.log(responsetoJson);
     }
        
      */
    

    

     // Funktion zum Laden der Benutzerdaten aus Firebase
     async function loadData(path = "User.json") {
        try {
            let response = await fetch(Base_URL + path);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let responsetoJson = await response.json();
            return responsetoJson;
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }
    
    async function loginButtonOnClick(event) {
        event.preventDefault(); // Prevent form from submitting
    
        const email = document.getElementById('Login-mail-input').value.trim();
        const password = document.getElementById('Login-password-input').value.trim();
    
        if (email && password) {
            try {
                const users = await loadData("User.json");
                if (users) {
                    let userFound = false;
                    for (let userId in users) {
                        let user = users[userId];
                        if (user.Email === email && user.Password === password) {
                            userFound = true;
                            console.log("Login successful");
    
                            // Weiterleitung zur summaryUser.html nach erfolgreicher Anmeldung
                            window.location.href = "summaryUser.html";
    
                            // Optional: Speichern der aktuellen Benutzerdaten in localStorage oder sessionStorage
                            // localStorage.setItem('currentUser', JSON.stringify(user));
                            break;
                        }
                    }
                    if (!userFound) {
                        alert("Email oder Passwort ist falsch");
                    }
                } else {
                    alert("Fehler beim Laden der Benutzerdaten");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Fehler beim Laden der Benutzerdaten");
            }
        } else {
            alert("Email und Passwort sind erforderlich!");
        }
    }
    
    // Diese Funktion wird beim Laden der Seite aufgerufen, um die Benutzerdaten zu laden
    async function onload() {
        try {
            const users = await loadData("User.json");
            console.log(users);
        } catch (error) {
            console.error("Error:", error);
        }
    }