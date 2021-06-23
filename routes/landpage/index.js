const landpage = require('express').Router();

const indexes = require('./indexes')
const most_performing = require('./most_performing')
const like_tickers = require('./liked_tickers')

landpage.use('/indexes', indexes);
landpage.use('/most_performing', most_performing);
landpage.use('/liked_tickers', like_tickers);

module.exports = landpage;