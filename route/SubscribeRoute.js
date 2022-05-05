const express = require('express');
const SubscriberController = require('../controller/SubscriberController');

const router = express.Router();

router.post('/subscribe', SubscriberController.subscribe);

module.exports = router;