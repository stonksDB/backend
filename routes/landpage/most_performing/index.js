var express = require('express');

var router = express.Router();

const sequelize = require('../../../sequelize');
const { getHistoryTicker } = require('../../utils/history_manager')

/**
 * returns a JSON array [{"ticker" : {<price_values>}]
 */
router.get('/', (req, res) => {
    const LIMIT = req.query.limit ?? 4; // 5 is default value

    return sequelize.models.stock.findAll({
        order: [
            ['ratio', 'DESC']
        ],
        attributes: ["ticker", "name"],
        limit: LIMIT
    }).then(result => { res.status(200).send(JSON.stringify(result))})
    .catch(err => {res.status(500).send(JSON.stringify(err))})
});

module.exports = router;