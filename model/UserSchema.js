const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    country: {type: String},
    departments: Array,
    state_type: {type: Boolean}
});
module.exports = mongoose.model('User', UserSchema);