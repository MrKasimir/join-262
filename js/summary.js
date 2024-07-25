let currentTime = new Date();
let stunden = currentTime.getHours();

function init() {
  displayTime();
  displayName();
  greetUser();
  
}

function openMenue() {
  let miniMenue = document.querySelector(".logOut");
  if (miniMenue.classList.contains("displayNone")) {
    miniMenue.classList.remove("displayNone");
  } else {
    miniMenue.classList.add("displayNone");
  }
}

function displayTime() {
  let options = { year: "numeric", month: "long", day: "numeric" };
  let formattedDate = currentTime.toLocaleDateString("en-US", options);

  let currentDateHeadline = document.getElementById("userDate");
  currentDateHeadline.innerHTML = formattedDate;

  let timeOfDayElement = document.getElementById("timeOfDay");

  if (stunden < 12) {
    console.log("Guten Morgen!");
    timeOfDayElement.innerHTML = "Good Morning,";
  } else if (stunden < 18) {
    console.log("Guten Nachmittag!");
    timeOfDayElement.innerHTML = "Good Afternoon,";
  } else {
    console.log("Guten Abend!");
    timeOfDayElement.innerHTML = "Good Evening";
  }
}

function displayName() {
  window.loggedinUser = JSON.parse(localStorage.getItem("loggedinUser")) || [];
  let usernameElement = document.getElementById("UserName");
  if (window.loggedinUser.length > 0) {
    let userName = window.loggedinUser[0].Name;
    let nameParts = userName.split(" ");

    let formattedName = "";
    if (nameParts.length >= 2) {
      let firstName =
        nameParts[0].charAt(0).toUpperCase() +
        nameParts[0].slice(1).toLowerCase();
      let lastName =
        nameParts[1].charAt(0).toUpperCase() +
        nameParts[1].slice(1).toLowerCase();
      formattedName = firstName + " " + lastName;
    } else if (nameParts.length === 1) {
      formattedName =
        nameParts[0].charAt(0).toUpperCase() +
        nameParts[0].slice(1).toLowerCase();
    }

    usernameElement.innerHTML = formattedName;
    console.log(formattedName);
  } else {
    usernameElement.innerHTML = "No user logged in";
  }
  getInitials();
}

function getInitials() {
  if (window.loggedinUser && window.loggedinUser.length > 0) {
    let userName = window.loggedinUser[0].Name; // holt den Benutzernamen

    let nameParts = userName.split(" "); // teilt den Benutzernamen auf

    let initials = "";
    if (nameParts.length >= 2) {
      initials = nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase(); // nimmt den ersten Buchstaben von Vor- und Nachname
    } else if (nameParts.length === 1) {
      initials = nameParts[0][0].toUpperCase(); // nimmt beide anfangsbuchstaben und macht so groß
    }

    // Setze die Initialen in das Element mit der ID 'topBannerName'
    document.getElementById("topBannerName").innerHTML = initials;
  }
}

let userInitials = getInitials();
console.log("User Initials: ", userInitials);

//** Mobile greeting script */

function greetUser() {
  window.loggedinUser = JSON.parse(localStorage.getItem("loggedinUser")) || [];
  let timeOfDayElement = document.getElementById("timeOfDayMobile");

  if (stunden < 12) {
    console.log("Guten Morgen!");
    timeOfDayElement.innerHTML = "Good Morning,";
  } else if (stunden < 18) {
    console.log("Guten Nachmittag!");
    timeOfDayElement.innerHTML = "Good Afternoon,";
  } else {
    console.log("Guten Abend!");
    timeOfDayElement.innerHTML = "Good Evening";
  }

  displayNameMobile();
  
}


function displayNameMobile(){
    window.loggedinUser = JSON.parse(localStorage.getItem("loggedinUser")) || [];
  let usernameElement = document.getElementById("UserNameMobile");
  if (window.loggedinUser.length > 0) {
    let userName = window.loggedinUser[0].Name;
    let nameParts = userName.split(" ");

    let formattedName = "";
    if (nameParts.length >= 2) {
      let firstName =
        nameParts[0].charAt(0).toUpperCase() +
        nameParts[0].slice(1).toLowerCase();
      let lastName =
        nameParts[1].charAt(0).toUpperCase() +
        nameParts[1].slice(1).toLowerCase();
      formattedName = firstName + " " + lastName;
    } else if (nameParts.length === 1) {
      formattedName =
        nameParts[0].charAt(0).toUpperCase() +
        nameParts[0].slice(1).toLowerCase();
    }

    usernameElement.innerHTML = formattedName;
    console.log(formattedName);
  } 
  hidemobileGreeting();
}



function hidemobileGreeting() {
    setTimeout(function() {
    
        let mobileGreetingElements = document.getElementsByClassName('mobileGreeting');
        let mobileGreettextElements = document.getElementsByClassName('mobileGreettext');

        for (let i = 0; i < mobileGreetingElements.length; i++) {
            mobileGreetingElements[i].classList.add('hidden');
        }

        for (let i = 0; i < mobileGreettextElements.length; i++) {
            mobileGreettextElements[i].classList.add('hidden');
        }

        setTimeout(function() {
            for (let i = 0; i < mobileGreetingElements.length; i++) {
                mobileGreetingElements[i].style.display = "none";
            }
            for (let i = 0; i < mobileGreettextElements.length; i++) {
                mobileGreettextElements[i].style.display = "none";
            }
        }, 1000); 
    }, 3000); 
}

// summary APi  //

function displayTasks() {
  let TodoTasks = document.getElementById('todoTasks');
  let DoneTasks = document.getElementById('doneTasks');
  let UrgentTasks = document.getElementById('urgentTasks');
  let TasksInBoard = document.getElementById('taskInBoard');
  let TasksInProgress = document.getElementById('tasksInProgress');
  let AwaitingFeedback = document.getElementById('awaitingFeedback'); 
}


let defaultTasks = [
  {
    id: 0,
    category: "todo",
    title: "Contact Form and Imprint",
    titleCategory: "User Story",
    description: "Create contact form & imprint page",
    priority: "medium",
    assignedTo: "AB",
    subtasks: 1,
  },
];
function loadBoardFromLocalStorage() {
  const boardTasks = localStorage.getItem("board");
  console.log(boardTasks);
  if (!boardTasks) {
    return [];
  } else {
    return JSON.parse(boardTasks);
  }
  

}

// SummaryGuest

function initGuest() {
  displayTimeGuest();
  hidemobileGreeting();
}

function displayTimeGuest() {
  let options = { year: "numeric", month: "long", day: "numeric" };
  let formattedDate = currentTime.toLocaleDateString("en-US", options);

  let currentDateHeadline = document.getElementById("guestDate");
  currentDateHeadline.innerHTML = formattedDate;

  let timeOfDayElement = document.getElementById("timeOfDayGuest");

  if (stunden < 12) {
    console.log("Guten Morgen!");
    timeOfDayElement.innerHTML = "Good Morning,";
  } else if (stunden < 18) {
    console.log("Guten Nachmittag!");
    timeOfDayElement.innerHTML = "Good Afternoon,";
  } else {
    console.log("Guten Abend!");
    timeOfDayElement.innerHTML = "Good Evening";
  }
}
