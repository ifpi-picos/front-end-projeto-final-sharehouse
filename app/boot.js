const path = require('path');
const express = require('express');
const router = express();

router.use("/assets", express.static(path.resolve(__dirname + '/../assets')));

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});

router.get('/detail', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/detail.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/register.html'));
});

router.get('/post', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/post.html'));
});

router.get('/settings', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/settings.html'));
});

router.listen(3000, () => console.log('Listening: http://127.0.0.1:3000'));