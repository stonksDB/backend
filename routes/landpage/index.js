const landpage = require('express').Router();

const indexes = require('./indexes')
const most_performing = require('./most_performing')
const like_tickers = require('./liked_tickers')

let checkUserLogged = () => {
    return (req, res, next) => {
        if (req.session.user)  // means user is logged in
            next();
        else
            return res.sendStatus(401);
    }
}

landpage.use('/indexes', indexes);
landpage.use('/most_performing', most_performing);
landpage.use('/liked_tickers', checkUserLogged(), like_tickers);

module.exports = landpage;