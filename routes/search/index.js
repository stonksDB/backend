const news = require('express').Router();
const { models } = require('../../sequelize');
const { Op } = require('sequelize');

news.get("/", getSearchSuggestions);

async function getSearchSuggestions(req, res) {

    const key = req.query.key ?? "";

    const withParametersTicker = buildQueryTicker(3, key.toUpperCase());
    const withParametersName = buildQueryName(3, key.toUpperCase());

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
        attributes: ["name", "ticker"],
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
        attributes: ["name", "ticker"],
        limit: limit
    }

    return query;
}

module.exports = news;