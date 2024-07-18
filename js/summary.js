
console.log(window.globalArray);

function openMenue() {
    let miniMenue = document.querySelector('.logOut');
    if (miniMenue.classList.contains('displayNone')) {
        miniMenue.classList.remove('displayNone');
    } else {
        miniMenue.classList.add('displayNone');
    }
}

function displayTime() {
    let aktuelleZeit = new Date();
    let stunden = aktuelleZeit.getHours();
    
    console.log(stunden, aktuelleZeit);
    
   
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
    }
    
}


function init(){
   displayTime();
   displayName();
}


function displayName() {
    window.loggedinUser = JSON.parse(localStorage.getItem('loggedinUser')) || [];
    let usernameElement = document.getElementById('UserName');
    if (window.loggedinUser.length > 0) {
        usernameElement.innerHTML = window.loggedinUser[0].Name; 
        console.log(window.loggedinUser[0].Name);
    } else {
        usernameElement.innerHTML = "No user logged in";
    }
}
console.log("summary.js loaded");


// SummaryGuest

function initGuest(){
    displayTimeGuest()
}

function displayTimeGuest() {
    let aktuelleZeit = new Date();
    let stunden = aktuelleZeit.getHours();
    
    console.log(stunden, aktuelleZeit);
    
   
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