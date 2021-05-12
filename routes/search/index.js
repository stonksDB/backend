const news = require('express').Router();
const { models } = require('../../sequelize');
const { Op } = require('sequelize');

/**
 * @swagger
 * /search:
 *   get:
 *     description: Search for any keyword
 *     parameters:
 *       - in: query
 *         name: key          
 *         
 *     responses:
 *       200:
 *         description: Returns a ticker, or a company that has the key value in the name
 */
news.get("/", getSearchSuggestions);

async function getSearchSuggestions(req, res) {

    const key = req.query.key ?? "";    

    const withParametersTicker = buildQueryTicker(3, key);
    const withParametersName = buildQueryName(3, key);

    try {

        const rows_ticker = await models.stock.findAll(withParametersTicker);
        const rows_name = await models.stock.findAll(withParametersName);

        const result = {
            tickers: rows_ticker,
            names: rows_name,
        }

        res.status(200).json(result);
    } catch (error) {
        console.log("there was an error", error)
    }

};

function buildQueryTicker(limit, key) {

    const query = {
        where: {
            [Op.and]: [
                { ticker: { [Op.substring]: key } }
            ]
        },
        attributes: { include: ["name", "ticker"] },
        limit: limit
    }

    return query;
}

function buildQueryName(limit, key) {

    const query = {
        where: {
            [Op.and]: [
                { name: { [Op.substring]: key } }
            ]
        },
        attributes: { include: ["name", "ticker"] },
        limit: limit
    }

    return query;
}

module.exports = news;