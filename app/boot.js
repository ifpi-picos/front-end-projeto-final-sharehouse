const path = require('path');
const express = require('express');
const router = express();

router.use("/assets", express.static(path.resolve(__dirname + '/../assets')));

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../index.html'));
});

router.get('/detail', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../detail.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../register.html'));
});

router.get('/post', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../post.html'));
});

router.get('/settings', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../settings.html'));
});

router.listen(3000, () => console.log('Listening: http://127.0.0.1:3000'));