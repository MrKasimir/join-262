function openMenue() {
    let miniMenue = document.querySelector('.logOut');
    if (miniMenue.classList.contains('displayNone')) {
        miniMenue.classList.remove('displayNone');
    } else {
        miniMenue.classList.add('displayNone');
    }
}


function openMobileMenu() {
    const sidebarIcons = document.getElementsByClassName('mobileSidebaricons');
    const sidebar = document.querySelector('.mobileSidebar');

    // Toggle the display of the sidebar
    const isMenuOpen = sidebar.style.display === 'flex';
    const displayStyle = isMenuOpen ? 'none' : 'flex';

    sidebar.style.display = displayStyle;
    Array.from(sidebarIcons).forEach(icon => icon.style.display = displayStyle);
}


window.addEventListener('resize', () => {
    const sidebarIcons = document.getElementsByClassName('mobileSidebaricons');
    const sidebar = document.querySelector('.mobileSidebar');

    if (window.innerWidth > 600) {
        sidebar.style.display = 'none';
       /* sidebarIcons.style.display = 'none';*/
    }
});
 