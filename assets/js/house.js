const enviar = document.querySelector('#anuciar');
const imagem = document.querySelector('#photo2');
const handleImageUpload = event => {
    const url = 'http://localhost:3000/house/imagem';
    const formData = new FormData();
    
    for (const file of event) {
        console.log('file', file)
        formData.append('file', file)
    }
    console.log('formData', formData)
    const options = {
        // 'Content-Type': 'multipart/form-data; boundary=—-WebKitFormBoundaryfgtsKTYLsT7PNUVD'
        method: 'POST',
        mode: 'cors', // pode ser cors ou basic(default)
        redirect: 'follow',
        body: formData,
        headers: new Headers({
            'Accept': 'application/json, text/plain, */*',
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUGF1bG8iLCJlbWFpbCI6InBhdWxvamhvbGVAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE1Nzk2OTQyNzEsImV4cCI6MTU3OTg2NzA3MX0.F_hkBmYrUx-T1GxjzcKZhTw5uXei1gsAKtiJMpB24lE'
        })
    }
    console.log(options);
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error(error)
        })
}

imagem.addEventListener('change', () => {
    handleImageUpload(imagem.files);
})