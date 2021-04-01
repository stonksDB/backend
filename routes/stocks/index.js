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

        const {total, stocks} = await models.stock.findAndCountAll(withParameters);

        const result = {
            data: {
                stocks: stocks
            },
            pageable: {
                offset: offset,
                limit: limit,
                total: total
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