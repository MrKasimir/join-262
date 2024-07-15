   
   const Base_URL = "https://join-262-default-rtdb.europe-west1.firebasedatabase.app/";

   // Sign UP

   function onSignUpName(Name) {
        //deletData("/name");
        postData("User_ID", {"Name": Name});  
    }

    function onSignUpEmail(Email) {
        //deletData("/name");
        postData("User_ID", {"Email": Email});  
    }

    function onSignUpPasswort(Password) {
        //deletData("/name");
        postData("User_ID", {"Password": Password});  
    }

    function SignUpButtonOnClick() {
        const Name = document.getElementById('SignUp-Name').value;
        const Email = document.getElementById('SignUp-Email').value;
        const Password = document.getElementById('SignUp-Password').value;
        const confirmPassword = document.getElementById('SignUp-ConfirmPassword').value;

        checkPasswort(Password, confirmPassword, Name, Email,);
    }


    function checkPasswort(Password, confirmPassword, Name, Email) {
        if (Password === confirmPassword) { 
        onSignUpEmail(Email);
        onSignUpName(Name);
        onSignUpPasswort(Password);
        } else {
            alert("Password stimmt nicht überein!")

        }
    }

    async function postData(path="", data={}){ // funktion um daten zu pushen 
        let response = await fetch(Base_URL + path +".json",{
            method: "POST", // methode kann geändert werden in "PUT", "DELETE", "PATCH" ,"GET"
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return responsetoJson =  await response.json();
     }


     // Login ´

     function onload(){
      
        console.log(responsetoJson);
     }

     async function loadData(path="User_ID"){ // funktion um daten von firebase zu laden 
        let response = await fetch(Base_URL + path +".json");
        let responsetoJson =  await response.json();
        console.log(responsetoJson);
     }
     

     function loginButtonOnClick() {
        loadData(path);
        if (condition) {
            
        } else {
            alert("Email oder Passwort ist Falsch")
        }
     }

     function getInputData(){
        const Email = document.getElementById('Login-mail-input')
        const Password = document.getElementById('Login-password-input')
     }







async function loadData(path = "User") { // Function to load data from Firebase
    try {
        let response = await fetch(Base_URL + path + ".json");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let responsetoJson = await response.json();
        console.log(responsetoJson);
        return responsetoJson;
    } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
    }
}

function loginButtonOnClick() {
    const { email, password } = getInputData();
    loadData().then(users => {
        if (users) {
            let userFound = false;
            for (let userId in users) {
                let user = users[userId];
                if (user.Email === email && user.Passwort === password) {
                    userFound = true;
                    console.log("Login successful");
                    // Process further after successful login
                    break;
                }
            }
            if (!userFound) {
                alert("Email oder Passwort ist Falsch");
            }
        } else {
            alert("Error loading user data");
        }
    });
}

function getInputData() {
    const email = document.getElementById('Login-mail-input').value;
    const password = document.getElementById('Login-password-input').value;
    return { email, password };
}

// Call this function on page load
function onload() {
    loadData().then(responsetoJson => {
        console.log(responsetoJson);
    });
}