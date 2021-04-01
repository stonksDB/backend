const stocks = require('express').Router();
const { models } = require('../../sequelize');

stocks.get("/:mic", getStocksByMic);
stocks.get("/", getAllStocks)

async function getStocksByMic(req, res) {

    var offset = req.query.offset ?? 0
    var limit = req.query.limit ?? 5

    try {
        const stocks = await models.stock.findAll({
            where: {
                mic: req.params.mic,
            },
            order: [['ticker', 'ASC']],
            offset: offset,
            limit: limit
        });

        res.status(200).json(stocks);
    } catch (error) {
        console.log("there was an error", error)
    }

};

async function getAllStocks(req, res) {

    var offset = req.query.offset ?? 0
    var limit = req.query.limit ?? 5

    try {
        const stocks = await models.stock.findAll({
            order: [['ticker', 'ASC']],
            offset: offset,
            limit: limit
        });
        res.status(200).json(stocks);
    } catch (error) {
        console.log("there was an error", error)
    }

};

module.exports = stocks;