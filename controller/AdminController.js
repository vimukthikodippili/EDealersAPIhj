const AdminSchema = require('../model/AdminSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUp = async (req, resp) => {

    bcrypt.hash(req.body.password, 10, function (err, hash) {
        const admin = new AdminSchema({
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email,
            password: hash,
            department: req.body.department,
            position: req.body.position,
            type: req.body.type,
            state_type: req.body.state_type
        });
        admin.save().then(async result => {
            const token = jwt.sign({
                email: req.body.email
            }, process.env.SECRET_KEY);
            resp.status(201).json({result: token, message: 'saved!'});
        }).catch(error => {
            resp.status(500).json({error: error, message: 'InternalServer Error!'});
        })
    });
}
const login = (req, resp) => {

    AdminSchema.findOne({email: req.body.email}).then(existsUser => {
        if (existsUser != null) {
            bcrypt.compare(req.body.password, existsUser.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({
                        email: req.body.email
                    }, process.env.SECRET_KEY);
                    resp.status(200).json({result: token,state:true});
                } else {
                    resp.status(401).json({message: 'UnAuthorized Attempt!'});
                }
            });
        } else {
            resp.status(404).json({message: 'User Not Found!'});
        }
    })

}
module.exports = {
    signUp, login
}