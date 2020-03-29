const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken-promisified');

const bcrypt = require('bcryptjs');
const models = require("../models");

/**
 * Set up passport strategies
 * @param passport
 * @returns {*}
 */
function passportSetup(passport) {

    /**
     * Local strategy:
     *
     * We have to check the identity of the user by ourselves.
     */
    passport.use('local', new LocalStrategy({
            passReqToCallback: true,
            session: false
        },

        // verify function

        async (req, username, password, done) => {

            try {
                let user = await models.User.findOne({
                    where: {username: username}
                });

                if (user) {
                    let encryptedPassword = user.password;

                    if (await bcrypt.compare(password, encryptedPassword)) {

                        // yay, we have a user property
                        // lets create a signed JWT that lives 10 minutes

                        let signedToken = await jwt.signAsync({
                            exp: Math.floor(Date.now() / 1000) + (60 * 10),
                            id: user.id,
                            username: user.username,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            role: user.role,

                        }, process.env.JWT_SECRET);

                        let requestUser = {
                            username: username,
                            jwt: signedToken
                        };

                        // We return an object on the request.
                        // This becomes req.user in our routes.

                        return done(null, requestUser);
                    }
                }
                return done(null, false);
            } catch (error) {
                return done(error, false);  // catch any login exception, i.e. database errors
                                            // TODO: this returns error message details to the client, which is bad in production
            }
        })
    );


    /**
     * JwtStrategy: let the JwtStrategy check the JWT.
     *
     * If the token is valid
     * - not expired
     * - signature ok
     *
     * then the lambda/arrow is called.
     *
     * If the token is invalid. an error is thrown that
     * has to be handled by the error handler.
     */

    passport.use('jwt', new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        },

        // verify function
        (jwtPayload, done) => {

            try {
                if (jwtPayload.username) {

                    // The JWT is valid, jwtPayload contains all the jwt payload data.
                    // We return an object here that is available in the routes as req.user.

                    // We filter all properties that are not relevant to the routes.

                    return done(null, {

                        id: jwtPayload.userid,
                        username: jwtPayload.username,
                        firstname: jwtPayload.firstname,
                        lastname: jwtPayload.lastname,
                        role: jwtPayload.role,
                    });
                } else {

                    // The JWT does not contain the expected payload.

                    return done(null, false);
                }
            } catch (error) {
                return done(error, false); // something went wrong in the jwt process
            }
        })
    );

    return passport;
};

module.exports = passportSetup;
