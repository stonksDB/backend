const stocks = require('express').Router();

const company = require('./company')
const history = require('./history')
const price = require('./price')

stocks.use('/company', company)
stocks.use('/history', history)
stocks.use('/price', price)

module.exports = stocks;