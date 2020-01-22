const config = {
    URL_BASE: 'http://127.0.0.1:3000'
}

function api(URL, METHOD) {
    return fetch(`${config.URL_BASE}${URL}`, {
        method: METHOD
    });
}