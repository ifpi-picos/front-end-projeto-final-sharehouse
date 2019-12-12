let sidenav = document.querySelector('.sidenav');
let userActions = document.querySelector('.user-actions');

let sidenavIsClosed = true;
let userActionsIsClosed = true;

if(document.body.clientWidth <= 1200) {
    sidenav.style.visibility = 'hidden';

    sidenav.style.height = 0;
    userActions.style.display = 'none';
}


const toggleMenu = () => {
    if (userActionsIsClosed == true) {
        userActions.style.display = 'flex';
    } else {
        userActions.style.display = 'none';
    }

    userActionsIsClosed = !userActionsIsClosed;
};

const toggleSidenav = () => {
    if (sidenavIsClosed == true) {
        sidenav.style.visibility = 'visible';
        sidenav.style.height = '100%';
    } else {
        sidenav.style.visibility = 'hidden';
        sidenav.style.height = 0;
    }

    sidenavIsClosed = !sidenavIsClosed;
};