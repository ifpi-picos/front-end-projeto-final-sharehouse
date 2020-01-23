const base_api = 'https://share-houses.herokuapp.com';

const toggleMenu = () => {
    if (userActionsIsClosed == true) {
        document.querySelector('.user-actions').style.display = 'flex';
    } else {
        document.querySelector('.user-actions').style.display = 'none';
    }

    userActionsIsClosed = !userActionsIsClosed;
};

const toggleSidenav = () => {
    if (sidenavIsClosed == true) {
        document.querySelector('.sidenav').style.visibility = 'visible';
        document.querySelector('.sidenav').style.height = '100%';
    } else {
        document.querySelector('.sidenav').style.visibility = 'hidden';
        document.querySelector('.sidenav').style.height = 0;
    }

    sidenavIsClosed = !sidenavIsClosed;
};

function parseHTML(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t.content.cloneNode(true);
}

async function getPage(page, optional = []) {
    document.querySelector('body #load-page').innerHTML = '';

    try {
        fetch(`views/${page}.html`, {
            method: 'GET'
        })
        .then(toText => toText.text())
        .then(res => {
            document.querySelector('body #load-page').innerHTML = res;

            plugins(page);

            if(page == 'house') {
                loadHouse(optional);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

getPage('home');

async function settingsJS() {
    let user = await userDetails();

    document.querySelector('.settings-form img').setAttribute('src', user.avatar);
    document.querySelector('.settings-form #name').setAttribute('value', user.name);

    document.querySelector('.settings-form').addEventListener('submit', (e) => {
        e.preventDefault();

        let formData = new FormData();

        formData.append('file', document.querySelector('.settings-form #avatar').files[0]);
        formData.append('name', document.querySelector('.settings-form #name').value);
        formData.append('password', document.querySelector('.settings-form #password').value);

        fetch(base_api + '/users/' + user.id, {
            method: 'PUT',
            body: formData
        })
        // .then(toJSON => toJSON.json())
        // .then(res => getPage('settings'));
    });
}

function registerJS() {
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

        let avatar = document.querySelector('#register #avatar').files[0];
        let username = document.querySelector('#register #username').value;
        let email = document.querySelector('#register #email').value;
        let password = document.querySelector('#register #password').value;
        let gender = document.querySelector('#register #gender').value;
        let address = document.querySelector('#register #address').value;

        let formData = new FormData();
        formData.append('file', avatar);
        formData.set('name', username);
        formData.set('email', email);
        formData.set('password', password);
        formData.set('sexo', gender);
        formData.set('address', address);

        try {
            fetch(base_api + '/users', {
                method: 'POST',
                body: formData
            })
            .then(toJSON => toJSON.json())
            .then(res => {
                if(res.msg) {
                    alert(res.msg);
                } else {
                    getPage('home');
                }
            });
        } catch (error) {
            console.error(error);
        }
    });
}

document.querySelector('.login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    try {
        fetch(base_api + '/users/authenticate', {
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

            if(errors) {
                errors.forEach(item => {
                    alert(item.msg);
                });
            } else {
                alert('Logado com sucesso!');
                localStorage.setItem('token', res.token);
                
                window.history.back(-1);
            }
        });
    } catch (error) {
        console.error(error);
    }
});

function money(total) {
    return (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function plugins(page = null) {
    if(page == 'home') {
        let houseResults = document.querySelector('.house-results');

        fetch(base_api + '/house')
        .then(toJSON => toJSON.json())
        .then(res => {
            let results = [];

            for(let i = 0; i < res.length; i++) {
                let item = res[i];
                results[i] = `<div class="house">
                <div class="image"> <img src="${item.urlImagem[0].url}" alt=""> </div>
                <div class="details">
                    <div class="box">
                        <div class="tags"> <span class="plus">NOVO</span>
                            <div class="quantity">${item.baths} banheiro • ${item.beds} quarto</div>
                        </div><a href="javascript:getPage('house', '${item._id}')" class="announce no-underline">${item.title}</a>
                        <div class="value"> <span class="price">R$ ${money(item.price)}</span> <span class="tmp">/mês</span> </div>
                        <div class="rating">
                            <span>${item.address}</span>
                        </div>
                    </div>
                </div>
            </div>`;
            }

            houseResults.innerHTML = results;
        });
    }

    if(page == 'settings') {
        settingsJS();
    }

    if(page == 'register') {
        registerJS();
    }

    if(page == 'post') {
        /** Single File **/
        document.querySelector('#photo').addEventListener('change', function() {
            document.querySelector('.photo').classList.remove('d-none');

            if (this.files && this.files[0]) {
                var img = document.querySelector('.photo img');  // $('img')[0]
                img.src = URL.createObjectURL(this.files[0]); // set src to blob url
            }
        });
        
        /** Multiple Files **/
        document.querySelector('#album').addEventListener('change', function() {
            document.querySelector('.album').classList.remove('d-none');

            document.querySelector('.album').innerHTML = '';
            if (this.files && this.files[0]) {
                for(var i = 0; i < this.files.length; i++) {
                    document.querySelector('.album').insertAdjacentHTML('beforeend', `<img src="${URL.createObjectURL(this.files[i])}" class="img-rounded${ i != 0 ? ' ml-2' : ''}" width="300" alt="${this.files[i].name}" />`);
                }
            }
        });

        document.querySelector('.house-form').addEventListener('submit', (e) => {
            e.preventDefault();
            document.querySelector('.house-form').style.opacity = 0.5;

            let formData = new FormData();
            formData.append('file', document.querySelector('.house-form #photo').files[0]);
            
            for(var i = 0; i < document.querySelector('.house-form #album').files.length; i++) {
                formData.append('file', document.querySelector('.house-form #album').files[i]);
            }

            formData.set('title', document.querySelector('.house-form #title').value);
            formData.set('contact', document.querySelector('.house-form #contact').value);
            formData.set('details', document.querySelector('.house-form #details').value);
            formData.set('price', document.querySelector('.house-form #price').value);
            formData.set('address', document.querySelector('.house-form #address').value);
            formData.set('beds', document.querySelector('.house-form #beds').value);
            formData.set('baths', document.querySelector('.house-form #baths').value);
            formData.set('type', document.querySelector('.house-form #type').value);

            let selectedValues = getSelectValues(document.querySelector('.house-form #amenities'));

            for(let i = 0; i < selectedValues.length; i++) {
                formData.append('amenities', selectedValues[i]);
            }

            try {
                fetch(base_api + '/house/imagem', {
                    method: 'POST',
                    body: formData
                })
                .then(toJson => toJson.json())
                .then(res => {
                    document.querySelector('.house-form').style.opacity = 1;
                    getPage('home');
                });
            } catch (error) {
                console.error(error);
            }
        });
    }
}

function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }

function postReset() {
    document.querySelector('.photo').classList.add('d-none');
    document.querySelector('.album').classList.add('d-none');

    document.querySelector('.album').innerHTML = '';
}

let sidenavIsClosed = true;
let userActionsIsClosed = true;

header().then(html => {
    document.querySelector('.header-render').innerHTML = html;

    if(document.body.clientWidth <= 1200) {
        document.querySelector('.sidenav').style.visibility = 'hidden';

        document.querySelector('.sidenav').style.height = 0;
        document.querySelector('.user-actions').style.display = 'none';
    }


    document.querySelector('.header .search-form').addEventListener('submit', (e) => {
        e.preventDefault();

        filter(document.querySelector('.header .search-form .search').value);
    });

    document.querySelector('.main .search-form').addEventListener('submit', (e) => {
        e.preventDefault();

        filter(document.querySelector('.main .search-form .search').value);
    });
});



async function userDetails() {
    try {
        const res = await fetch(base_api + '/users/me', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(toJSON => toJSON.json());

        return res;
    } catch (error) {
        throw new Error(error);
    }
}

async function header() {
    var user = await userDetails();

    let menuOptions = null;

    if(localStorage.getItem('token') != null) {
        menuOptions = `<div class="items">
        <a href="javascript:getPage('post')">Anuncie sua propriedade</a>
        <a href="javascript:alert('Entre em contato com o nosso call center: (89) 9 9401-1019');">Ajuda</a>
    </div>

    <div class="d-flex items-center">
        <div class="avatar md:mt-2" ${user.avatar ? `style="background-image: url(${user.avatar})` : ''}">
            <input class="dropdown-toggle" type="checkbox">

            <div class="dropdown">
                <a href="javascript:getPage('settings')">Configurações</a>
                <a href="javascript:alert('Entre em contato com o nosso call center: (89) 9 9401-1019');">Suporte</a>
                <a href="javascript:logout();">Fazer logout</a>
            </div>
        </div>
        
        <a href="#" class="d-none md:d-block username mt-2 ml-4 text-white no-underline semibold">${user.name}</a>
    </div>`;
    } else {
        menuOptions = `<div class="items">
        <a href="javascript:getPage('register')">Criar uma conta</a>
        <a href="#login">Fazer Login</a>
    </div>`;
    }

    return `<header class="header d-flex">
    <div class="brand d-flex">
        <div class="d-flex items-center">
            <svg class="logo-svg" xmlns="http://www.w3.org/2000/svg" width="29.103" height="25" viewBox="0 0 29.103 25"><path d="M15.551,2.1l-2.739,2.46a6.292,6.292,0,0,1,.956.858c.026.026.047.062.072.088A6.516,6.516,0,0,1,14.6,6.52l.005-.005c.041.078.1.145.145.227A6.616,6.616,0,0,1,18.2,12.55a6.912,6.912,0,0,1-.1,1.188,6.614,6.614,0,0,1-5.188,10.717V27.1H26.134V15.2H30.1ZM8.937,5.936a3.977,3.977,0,0,0-3.8,2.816,3.968,3.968,0,0,0-2.3,5.746A3.967,3.967,0,0,0,4.969,21.81H7.614V27.1H10.26V21.81h2.646A3.967,3.967,0,0,0,15.04,14.5a3.968,3.968,0,0,0-2.3-5.746A3.977,3.977,0,0,0,8.937,5.936Z" transform="translate(-1 -2.102)" fill="#edf2f7"/></svg>
            <a class="logo" href="javascript:getPage('home');">Share House</a>
        </div>

        <div class="hamburguer d-none md:d-block" onClick="toggleMenu()">
            <input type="checkbox">
            <div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>

    <nav class="navbar d-flex justify-content-between items-center user-actions">
        <form class="search-form">
            <input class="form-control search" type="text" placeholder="Procure por palavras">
            <input type="submit" class="d-none">
        </form>

        <div class="d-flex md:d-block items-center">
            ${menuOptions}
        </div>
    </nav>
</header>`;
}

function logout() {
    localStorage.removeItem('token');

    return window.location.reload();
}

function sideNavFilter() {
    let price = document.querySelector('.filter-price').value;
    let type = document.querySelector('.filter-type').value;
    let amentities = document.querySelector('.filter-amentities').value;
    let beds = document.querySelector('.filter-beds').value;
    let baths = document.querySelector('.filter-baths').value;

    filter(null, price, type, amentities, beds, baths);
}

async function filter(title = null, price = null, type = null, amentities = null, beds = null, baths = null) {
    const res = await fetch(base_api + '/house/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            price: price,
            type: type,
            amentities: amentities,
            beds: beds,
            baths: baths
        })
    }).then(toJSON => toJSON.json());

    let houseResults = document.querySelector('.house-results');
    let results = [];

    for(let i = 0; i < res.length; i++) {
        let item = res[i];
        results[i] = `<div class="house">
        <div class="image"> <img src="${item.urlImagem[0].url}" alt=""> </div>
        <div class="details">
            <div class="box">
                <div class="tags"> <span class="plus">NOVO</span>
                    <div class="quantity">${item.baths} banheiro • ${item.beds} quarto</div>
                </div><a href="javascript:getPage('house', '${item._id}')" class="announce no-underline">${item.title}</a>
                <div class="value"> <span class="price">R$ ${money(item.price)}</span> <span class="tmp">/mês</span> </div>
                <div class="rating">
                    <span>${item.address}</span>
                </div>
            </div>
        </div>
    </div>`;
    }

    houseResults.innerHTML = results;
}

function loadHouse(_id) {
    fetch(base_api + '/house/' + _id)
    .then(toJSON => toJSON.json())
    .then(res => {
        let item = res[0];

        let gallery = `<div>
        <div class="image">
            <a href="${item.urlImagem[0].url}" target="_blank">
                <img src="${item.urlImagem[0].url}" alt="">
            </a>
        </div>
    </div>`;

        gallery += '<div class="column" style="flex-wrap: wrap;">';
        for(let i = 1; i < item.urlImagem.length; i++) {
            gallery += `<div class="image" style="flex-shrink: 0;"> <a href="${item.urlImagem[i].url}" target="_blank"><img src="${item.urlImagem[i].url}" alt=""></a> </div>`;
        }
        gallery += '</div>';

        document.querySelector('.house-render .gallery').innerHTML = gallery;
        document.querySelector('.house-render .details').innerHTML = item.details;
        document.querySelector('.house-render .contact').innerHTML = item.contact;
        document.querySelector('.title-house').innerHTML = item.title;
        document.querySelector('.total-beds').innerHTML = item.beds;
        document.querySelector('.total-baths').innerHTML = item.baths;
    });
}