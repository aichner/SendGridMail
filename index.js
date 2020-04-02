require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sendGrid = require('./my_modules/sendgrid');
const auth = require('./my_modules/authentification')
const utils = require('./utils');
const cors = require('cors');

app.use(cors(utils.corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/login', auth);
app.use('', sendGrid);

app.get('*', (req, res) => {
    res.status(200).send('Hello world');
});

app.use(utils.centralErrorHandler);

let port = (process.env.PORT || 3000);

app.listen(port, () => {
    console.log(`Server is up and running at http://localhost:${port}`);
})