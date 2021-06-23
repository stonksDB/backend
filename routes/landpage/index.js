const landpage = require('express').Router();

const indexes = require('./indexes')
const most_performing = require('./most_performing')

landpage.use('/indexes', indexes);
landpage.use('/most_performing', most_performing);

module.exports = landpage;