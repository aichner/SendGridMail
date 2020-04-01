require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sendGrid = require('./my_modules/sendgrid');
const auth = require('./my_modules/authentification')
const utils = require('./utils');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/login', auth);
app.use('', sendGrid);
app.use(utils.centralErrorHandler);

app.listen(process.env.port, () => {
    console.log(`Server is up and running at http://localhost:${process.env.port}`);
})