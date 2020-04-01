const express = require('express');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const utils = require('../utils');
const router = express.Router();
const sec1 = process.env.AUTH_SEC1;
const sec2 = process.env.AUTH_SEC2;

router.jwtMW = exjwt({
    secret: sec1
});

function checkRefreshToken(refreshToken) {
    try {
        return jwt.verify(refreshToken, sec2);
    } catch (err) {
        return null;
    }
}

router.post('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    if (req.body.hasOwnProperty('refreshToken')) { // check if user uses refresh token
        let token = checkRefreshToken(req.body.refreshToken);
        if (token != null) {
            let newToken = jwt.sign({ id: token.id, username: token.username }, sec1, { expiresIn: utils.durationToken });
            res.status(200).send({
                sucess: true,
                err: null,
                token: newToken,
                refreshToken: null
            });
        } else {
            res.status(401).send({
                sucess: false,
                token: null,
                err: 'The refresh token provided is incorrect'
            });
        }
    } else { // if not refresh token use username and password
        const { username, password } = req.body;
        for (let user of utils.users) {
            if (username == user.username && password == user.password) {
                let token = jwt.sign({ id: user.id, username: user.username }, sec1, { expiresIn: utils.durationToken });
                let refreshToken = jwt.sign({ id: user.id, username: user.username }, sec2, { expiresIn: utils.durationRefreshToken })
                res.status(200).send({
                    sucess: true,
                    err: null,
                    token,
                    refreshToken
                });
                break;
            }
            else {
                res.status(401).send({
                    sucess: false,
                    token: null,
                    err: 'Username or password is incorrect'
                });
            }
        }
    }
});

module.exports = router;