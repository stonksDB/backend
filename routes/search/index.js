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

    const withParameters = buildQuery(5, key);

    try {

        rows = await models.stock.findAll(withParameters);

        const result = {
            tickers: rows
        }

        res.status(200).json(result);
    } catch (error) {
        console.log("there was an error", error)
    }

};

function buildQuery(limit, key) {

    const query = {
        where: {
            [Op.and]: [
                { ticker: { [Op.substring]: key } }
            ]
        },
        limit: limit
    }

    return query;
}

module.exports = news;