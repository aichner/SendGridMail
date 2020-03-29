const express = require("express");
const router = express.Router();

const routes = () => {

    const router = express.Router();

    ///////////////////////////////////////////////////////////////////////////////////
    //
    // Login
    // - let the local strategy in app.js check the password and generate a token
    // - sends the token to the client
    //
    ///////////////////////////////////////////////////////////////////////////////////

    router.post('/', async (req, res, next) => {
        try {
            res.json(req.user);
        } catch (error) {
            next(error);
        }
    });

    return router;
};

module.exports = routes;
