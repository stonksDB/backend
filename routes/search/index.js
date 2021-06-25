const news = require('express').Router();
const sequelize = require('../../sequelize');
const { Op } = require('sequelize');

const DEFAULT_EMPTY_STRING = ""

/**
 * endpoint supporting the interactive search-bar
 */
news.get("/", getSearchSuggestions);

async function getSearchSuggestions(req, res) {

	const searchKey = req.query.key ?? DEFAULT_EMPTY_STRING;

	const RESULT_LIMIT = 3;

	const byTicker = buildQueryByTicker(RESULT_LIMIT, searchKey.toUpperCase());
	const byName = buildQueryByName(RESULT_LIMIT, searchKey.toUpperCase());

	try {
		const matches_ticker = await sequelize.models.stock.findAll(byTicker);
		const matches_name = await sequelize.models.stock.findAll(byName);

		// merge results together
		const result = {
			tickers: matches_ticker,
			names: matches_name,
		}

		return res.status(200).json(result);

	} catch (error) {
		return res.status(500).json(error);
	}

};

/**
 * 
 * @param {Integer} limit number of matching tickers returned 
 * @param {String} searchKey substirng to be matched
 * @returns query object
 */
let buildQueryByTicker = (limit, searchKey) => {

	const query = {
		where: {
			ticker: { [Op.substring]: searchKey }
		},

		attributes: ["name", "ticker"], // returned attributes
		limit: limit
	}

	return query;
}

/**
 * 
 * @param {Integer} limit number of matching company names returned
 * @param {String} searchKey 
 * @returns 
 */
let buildQueryByName = (limit, searchKey) => {

	const query = {
		where: {
			[Op.and]: [
				{ name: { [Op.substring]: searchKey } }
			]
		},
		attributes: ["name", "ticker"],
		limit: limit
	}

	return query;
}

module.exports = news;