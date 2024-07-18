
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
let loggedinUser =[];

function init(){
    displayTime(); 
}


function displayName(){
  let Username =   document.getElementById('UserName');
  
}




'UserName'