const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors')
/*--------------------------*/

const adminRoute = require('./route/AdminRoute');
const inquiryRoute = require('./route/InquiryRoute');

/*--------------------------*/
const serverPort = process.env.SERVER_PORT;
const app = express();
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/e_dealers', () => {
    app.listen(serverPort, () => {
        console.log(`E-Dealers server is up & Running on : ${serverPort}`);
    });
});
/*------------------------------*/
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/inquiry', inquiryRoute);
/*------------------------------*/