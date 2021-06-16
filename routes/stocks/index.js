const stocks = require('express').Router();
const { models } = require('../../sequelize');

stocks.get("/:mic", getStocksByMic);
stocks.get("/", getStocksByMic)

async function getStocksByMic(req, res) {

    var offset = req.query.offset ?? 0
    var limit = req.query.limit ?? 5
    var mic = req.params.mic ?? "*"

    const withParameters = buildQuery(mic, offset, limit);

    try {

        const {count, rows} = await models.stock.findAndCountAll(withParameters);

        const result = {
            data: {
                stocks: rows
            },
            pageable: {
                offset: offset,
                limit: limit,
                total: count
            }
        }

        res.status(200).json(result);
    } catch (error) {
        console.log("there was an error", error)
    }

};

function buildQuery(mic, offset, limit) {
    const query = {
        order: [['ticker', 'ASC']],
        offset: offset,
        limit: limit
    }

    if (mic != "*") {
        query.where = {
            mic: mic,
        }
    }

    return query;
}

module.exports = stocks;