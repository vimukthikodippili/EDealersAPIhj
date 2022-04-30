const express = require('express');
const InquiryController = require('../controller/InquiryController');

const router = express.Router();

router.post('/create', InquiryController.makeInquiry);
router.put('/modify', InquiryController.updateInquiry);
router.get('/list', InquiryController.listAllInquiries);

module.exports = router;