const base = 'http://127.0.0.1/sharehouse/web';

const isAuth = true;

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

function parseHTML(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t.content.cloneNode(true);
}

const routers = [
    { name: 'home', primary: true },
    { name: 'register' },
];

async function getPage(page) {
    document.querySelector('body #load-page').innerHTML = '';

    // history.pushState({}, 'Título da Página', `http://127.0.0.1:5500/web/#/${page}`);
    routers.find(router => {
        if(router.name == page && router.primary != true) {
            window.location.href = `http://127.0.0.1:5500/web/#/${page}`;
        } else {
            window.location.href = `http://127.0.0.1:5500/web/#/`;
        }
    });

    try {
        fetch(`pages/${page}.html`, {
            method: 'GET'
        })
        .then(toText => toText.text())
        .then(res => {
            document.querySelector('body #load-page').innerHTML = res;
        });
    } catch (error) {
        console.error(error);
    }
}

// if(window.location.hash == '' || window.location.hash == '#/') {
//     getPage('home');
// } else {
//     getPage(window.location.hash.replace('#', ''));
// }


function registerJS() {
    alert(1);
    let form = document.querySelector('#register');

    // stackoverflow: https://stackoverflow.com/a/3814285/5596633
    document.getElementById('avatar').addEventListener('change', (evt) => {
        var tgt = evt.target || window.event.srcElement,
            files = tgt.files;

        // FileReader support
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function () {
                document.getElementById('avatar-blob').src = fr.result;
            }
            fr.readAsDataURL(files[0]);
        } else { // Not supported 
            // fallback -- perhaps submit the input to an iframe and temporarily store
            // them on the server until the user's session ends.
            alert('Not supported');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let avatar = document.querySelector('#register #avatar').value;
        let username = document.querySelector('#register #username').value;
        let email = document.querySelector('#register #email').value;
        let password = document.querySelector('#register #password').value;
        let gender = document.querySelector('#register #gender').value;
        let address = document.querySelector('#register #address').value;

        let formData = new FormData(form);
        formData.append('avatar', avatar);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('gender', gender);
        formData.append('address', address);

        try {
            fetch('http://127.0.0.1:3000/users', {
                method: 'POST',
                body: formData
            });

            console.log('Deu certo');
        } catch (error) {
            console.error(error);
        }
    });
}

document.querySelector('.login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    try {
        fetch('http://127.0.0.1:3000/users/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.querySelector('.login-form #email').value,
                password: document.querySelector('.login-form #password').value
            })
        })
        .then(toJson => toJson.json())
        .then(res => {
            let { erro: errors } = res;

            errors.forEach(item => {
                alert(item.msg);
            });
        });
    } catch (error) {
        console.error(error);
    }
});