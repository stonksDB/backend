var express = require('express');
var router = express.Router();

const sequelize = require('../../../sequelize');

const DEFAULT_LIMIT = 4;

/**
 * returns a JSON array [{"ticker" : {<price_values>}]
 */
router.get('/', async (req, res) => {
    const limit = req.query.limit ?? DEFAULT_LIMIT;

    const byMostPerforming = buildQuery(limit);

    try {
        const mostPerformingCompanies = await sequelize.models.stock.findAll(byMostPerforming)
        res.status(200).json(mostPerformingCompanies)
    } catch (error) {
        res.status(500).send(error)
    }

});

/**
 * 
 * @param {Integer} limit number of matching company names returned
 * @returns 
 */
let buildQuery = (limit) => {

    const query = {
        order: [
            ['ratio', 'DESC']
        ],
        attributes: ["ticker", "name"],
        limit: limit
    }

    return query;
}

module.exports = router;