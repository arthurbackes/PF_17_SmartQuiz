const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.get('/signup', (req, res) => {
    res.render('user/signup', { errorMail: false});
});

router.get('/login', (req, res) => {
    res.render('user/login', { errorLogIn: false});
});

router.get('/logout', (req, res) => {
    userCtrl.logout(req, res);
});

router.get('/profile', userCtrl.profile);

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;