const mongoose = require('mongoose');
const InquirySchema = new mongoose.Schema({
    email: {type: String, required: true},
    name: {type: String, required: true},
    contact: {type: String, required: true},
    country: {type: String, required: true},
    placed_date_time: {type: Date},
    program_type: {type: String},
    inquiry_message: {type: String},
    available_state: {type: Boolean},
    other_data: {type: Array},
    state_type: {type: String}
});
module.exports = mongoose.model('Inquiry', InquirySchema);