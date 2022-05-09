const express = require('express');
const adminController = require('../controller/AdminController');

const router = express.Router();
router.post('/login', adminController.login);
router.post('/signup', adminController.signUp);


module.exports = router;