const request = require('request');
const express = require('express');
const auth = require('./authentification');
const router = express.Router();

router.post('/sendmail', auth.jwtMW, (req, res) => {
    let toMail = req.body.to;
    let templateData = req.body.templateData;
    let templateId = req.body.templateId;

    var headers = {
        'Authorization': 'Bearer ' + process.env.SENDGRID_API_KEY,
        'Content-Type': 'application/json'
    };

    var dataString = {
        "from": {
            "email": process.env.FROM_EMAIL
        },
        "personalizations": [
            {
                "to": [
                    {
                        "email": toMail
                    }
                ],
                "dynamic_template_data": templateData
            }
        ],
        "template_id": templateId,
        "headers": {
            "Organization": "Gutschein2Go",
            "x-sender": "Gutschein2Go noreply@gutschein2go.at",
            "x-mailer": "NodeJs"
        }
    };

    var options = {
        url: 'https://api.sendgrid.com/v3/mail/send',
        method: 'POST',
        headers: headers,
        body: JSON.stringify(dataString)
    };

    function callback(error, response, body) {
        if (error == null) {
            console.log('Successfully sent mail');
            console.log(response);
        } else {
            console.error(error);
            console.error(response);
            console.error(body);
        }
    }
    request(options, callback);
    res.status(200).send('OK');
});

module.exports = router;