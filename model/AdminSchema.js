const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
    fName: {type: String, required: true},
    lName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    department: {type: String},
    position: {type: String},
    type: {type: String, required: true},
    state_type: {type: Boolean}
});
module.exports = mongoose.model('Admin', AdminSchema);