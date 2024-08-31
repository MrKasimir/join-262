const Base_URL =
  "https://join262-default-rtdb.europe-west1.firebasedatabase.app/";
// SIGNUP
let Contacts = [];
 function init(){
  fetchUserData();
 }

async function fetchHighestUserID() {
  // retrieves JSON file from server and searches it for highest ID
  try {
    let response = await fetch(Base_URL + "User.json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let responsetoJson = await response.json();
    let highestID = 0;
    for (let key in responsetoJson) {
      let userID = parseInt(key.replace("UserID_", "")); //The key name ("UserID_12") for example is edited by removing the "UserID_" part.
      if (userID > highestID) {
        //the number is compared with the current highest ID    // The remaining string ("12") is then converted to a number (123).
        highestID = userID;
      }
    }
    return highestID;
  } catch (error) {
    console.error("Error fetching highest UserID:", error);
  }
}

async function postData(path = "User/User(collection)", data = {}) {
  // FUnction to Post Data in FB
  try {
    let response = await fetch(Base_URL + path + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let responsetoJson = await response.json();
    return responsetoJson;
  } catch (error) {
    console.error("Error:", error);
  }
}
//In onSignUp, userData is used to register the new user and store the data both locally and on the server
async function onSignUp(userData) {
  try {
    let highestID = await fetchHighestUserID(); // try to fetch highest ID
    let newUserID = `UserID_${highestID + 1}`; // create a new userID for the new user
    let response = await postData(`User/${newUserID}`, userData); // The function sends the user's data (userData) to the server using the postData function.
    console.log("User created:", response);
    pushToLocalArray(userData); // Push user data to local Contacts array
    window.location.href = "login.html"; // User gets redirected to Login page
  } catch (error) {
    console.error("Error in onSignUp:", error);
  }
}

function pushToLocalArray(userData) {
  // pushes user data to local storage
  Contacts.push(userData);
  console.log("Current Contacts Array:", Contacts);
}

function SignUpButtonOnClick(event) {
  //In the SignUpButtonOnClick function, userData is created and passed to the checkPassword function
  event.preventDefault();
  //Here userData is created as an object { Name, Email, Password } and passed to checkPassword.
  const Name = document.getElementById("SignUp-Name").value.trim(); // trim removes whitespaces
  const Email = document.getElementById("SignUp-Email").value.trim();
  const Password = document.getElementById("SignUp-Password").value.trim();
  const confirmPassword = document
    .getElementById("SignUp-ConfirmPassword")
    .value.trim();

  if (Name && Email && Password && confirmPassword) {
    // checks if all fields are filled
    checkPassword(Password, confirmPassword, { Name, Email, Password }); //The userData object is created inline as { Name, Email, Password }.
  } else {
    alert("All fields are required!");
  }
}

function checkPassword(Password, confirmPassword, userData) {
  //In checkPassword, userData is accepted as a parameter and passed on to onSignUp if the password check is successful:
  if (Password === confirmPassword) {
    onSignUp(userData);
  } else {
    alert("Passwords do not match!");
  }
}

// LOGIN //

let UserData = [];
window.loggedinUser = [];


async function fetchUserData() {
  try {
    let response = await fetch(Base_URL + "User.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let data = await response.json(); //Once the response is received, it is converted to a JSON object
    for (const userId in data) {
      // iterates through the recived data
      if (data.hasOwnProperty(userId)) {
        // checks if "data" object has teh property "userid"
        for (const key in data[userId]) {
          //Inside this loop it  iterates over each property (key) within the current userId object
          if (data[userId].hasOwnProperty(key)) {
            // Again, it checks if the property belongs to the userId object
            UserData.push({ userId: userId, id: key, ...data[userId][key] }); ////For each property, it pushes an object containing userId, id (the key), into the UserData array
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
 // checks if the input data matches with an already existing user
  for (const user of UserData) {
    console.log(`Checking user: ${user.Email}`);
    if (user.Email === inputMail && user.Password === inputPassword) {
      userFound = true;
      console.log("User found, redirecting...");
      saveLoggedInUser(user);
      window.location.href = "summaryUser.html"; 
      break; // breaks out of the loop is a matching user is found
    }
  }

  if (!userFound) {
    alert("Password oder Email ist falsch!");
  }
  return false;
}

function saveLoggedInUser(user) {
  const userToSave = {
    UserID: user.userId, //users ID is always saved under the key UserID.
    Email: user.Email,   // users Email adress
    Name: user.Name,     // users Name
    id: user.id,     
  };
  window.loggedinUser = [userToSave];
  console.log("Logged in user:", window.loggedinUser);
  localStorage.setItem("loggedinUser", JSON.stringify(window.loggedinUser));
}

console.log("signUpLogin.js loaded");

// Fetch user data when the script loads


function guestLogin() {
  window.location.href = "summaryGuest.html";
}
