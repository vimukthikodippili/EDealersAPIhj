const mongoose = require('mongoose');
const SubscriberSchema = new mongoose.Schema({
    email: {type: String, required: true},
    state_type: {type: Boolean},
    other_data: {type: Array}
});
module.exports = mongoose.model('Subscriber', SubscriberSchema);