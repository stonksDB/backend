const stocks = require('express').Router();
const { models } = require('../../sequelize');
const { Op } = require('sequelize');

stocks.get("/:ticker", getHistoryByTicker);

async function getHistoryByTicker(req, res) {

    const ticker = req.params.ticker;
    const from = req.query.from ?? 0
    const to = req.query.to ?? Date.now()

    const withParameters = buildQuery(ticker, from, to);    

    try {

        const { count, rows } = await models.history.findAndCountAll(withParameters);

        const result = {
            data: {
                history: rows
            },
            pageable: {
                total: count
            }
        }

        res.status(200).json(result);
    } catch (error) {
        console.log("there was an error", error)
    }

};

function buildQuery(ticker, from, to) {

    const query = {
        order: [['date', 'ASC']],
        where: {
            [Op.and]: [
                { date: { [Op.gte]: Number(from) } },
                { date: { [Op.lte]: Number(to) } },
                { ticker: ticker }
            ]
        }
    }

    return query;
}

module.exports = stocks;