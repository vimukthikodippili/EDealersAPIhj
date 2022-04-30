const express = require('express');
const adminController = require('../controller/AdminController');

const router = express.Router();

router.post('/signup', adminController.signUp);
router.post('/login', adminController.login);

module.exports = router;