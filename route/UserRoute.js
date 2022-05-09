const express = require('express');
const UserController = require('../controller/UserController');

const router = express.Router();

router.post('/register', UserController.register);
router.post('/forget-password', UserController.forgetPassword);
router.post('/reset', UserController.resetPassword);
router.post('/login', UserController.userLogin);


module.exports = router;