    let currentTime = new Date();
    let stunden = currentTime.getHours();
  
    function init(){
        displayTime();
        displayName();
     }
     
    
function openMenue() {
    let miniMenue = document.querySelector('.logOut');
    if (miniMenue.classList.contains('displayNone')) {
        miniMenue.classList.remove('displayNone');
    } else {
        miniMenue.classList.add('displayNone');
    }
}


function displayTime() {
    
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
let formattedDate = currentTime.toLocaleDateString('en-US', options);

let currentDateHeadline = document.getElementById('userDate');
currentDateHeadline.innerHTML = formattedDate;

let timeOfDayElement = document.getElementById('timeOfDay');

if (stunden < 12) {
    console.log("Guten Morgen!");
    timeOfDayElement.innerHTML = 'Good Morning,';
} else if (stunden < 18) {
    console.log("Guten Nachmittag!");
    timeOfDayElement.innerHTML = 'Good Afternoon,';
} else {
    console.log("Guten Abend!");
    timeOfDayElement.innerHTML = 'Good Evening';
}    }

function displayName() {
    window.loggedinUser = JSON.parse(localStorage.getItem('loggedinUser')) || [];
    let usernameElement = document.getElementById('UserName');
    if (window.loggedinUser.length > 0) {
        let userName = window.loggedinUser[0].Name;
        let nameParts = userName.split(' ');

        let formattedName = '';
        if (nameParts.length >= 2) {
            let firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
            let lastName = nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1).toLowerCase();
            formattedName = firstName + ' ' + lastName;
        } else if (nameParts.length === 1) {    
            formattedName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
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
        
        let nameParts = userName.split(' '); // teilt den Benutzernamen auf

        let initials = '';
        if (nameParts.length >= 2) {
            initials = nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase(); // nimmt den ersten Buchstaben von Vor- und Nachname
        } else if (nameParts.length === 1) {
            initials = nameParts[0][0].toUpperCase(); // nimmt den ersten Buchstaben des Namens
        }

        // Setze die Initialen in das Element mit der ID 'topBannerName'
        document.getElementById('topBannerName').innerHTML = initials;
    }
}


let userInitials = getInitials();
console.log("User Initials: ", userInitials);

let defaultTasks = [{
    'id': 0,
    'category': 'todo',
    'title': 'Contact Form and Imprint',
    'titleCategory': 'User Story',
    'description': 'Create contact form & imprint page',
    'priority': 'medium',
    'assignedTo': 'AB',
    'subtasks': 1,
}] 
 function loadBoardFromLocalStorage() {
    const boardTasks = localStorage.getItem('board');
    if (!boardTasks) {
        return [];
    }

    else {
        return JSON.parse(boardTasks);
    }
}


// SummaryGuest

function initGuest(){
    displayTimeGuest()
}

function displayTimeGuest() {

let options = { year: 'numeric', month: 'long', day: 'numeric' };
let formattedDate = currentTime.toLocaleDateString('en-US', options);

let currentDateHeadline = document.getElementById('guestDate');
currentDateHeadline.innerHTML = formattedDate;

let timeOfDayElement = document.getElementById('timeOfDayGuest');

if (stunden < 12) {
    console.log("Guten Morgen!");
    timeOfDayElement.innerHTML = 'Good Morning,';
} else if (stunden < 18) {
    console.log("Guten Nachmittag!");
    timeOfDayElement.innerHTML = 'Good Afternoon,';
} else {
    console.log("Guten Abend!");
    timeOfDayElement.innerHTML = 'Good Evening';
}
}
