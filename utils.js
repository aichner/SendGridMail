let users = [
    {
        id: 1,
        username: process.env.DB_USER,
        password: process.env.DB_PASS
    }
];

// seconds
const durationRefreshToken = 129600; // 90 d‬
const durationToken = 900; // 15 min

function centralErrorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send(err);
    } else if (err.message == 'Not allowed by CORS') {
        res.status(401).send('Not allowed from this origin.');
    } else {
        next(err);
    }
}

var whitelist = ['http://gutschein2go.at'];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

module.exports.centralErrorHandler = centralErrorHandler;
module.exports.users = users;
module.exports.durationRefreshToken = durationRefreshToken;
module.exports.durationToken = durationToken;
module.exports.corsOptions = corsOptions;