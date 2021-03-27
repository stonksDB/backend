const stocks = require('express').Router();
const allStocks = require('./allStocks');
const singleStock = require('./singleStock')

stocks.get("/all", allStocks);

stocks.get("/:ticker", singleStock)

module.exports = stocks;