
function openMenue() {
    let miniMenue = document.querySelector('.logOut');
    if (miniMenue.classList.contains('displayNone')) {
        miniMenue.classList.remove('displayNone');
    } else {
        miniMenue.classList.add('displayNone');
    }
}