const liked_tickers = require('express').Router();

const sequelize = require('../../../sequelize');

const DEFAULT_LIMIT = 4

/**
 * returns a JSON array [{"ticker" : {<price_values>}]
 */
liked_tickers.get('/', async (req, res) => {

    const LIMIT = req.query.limit ?? DEFAULT_LIMIT;

    const byLikedStockAndShareHolderId = buildQuery(limit, req.session.user.share_holder_id)

    sequelize.models.like.findAll(byLikedStockAndShareHolderId).then(result => {
        res.status(200).json(result)
    })
        .catch(err => { res.status(400).send(JSON.stringify(err)) })

});

/**
 * 
 * @param {String} shareHolderId the ID of the shareholder we would like to search
 * @param {Integer} limit number of matching company names returned
 * @returns 
 */
let buildQuery = (limit, shareHolderId) => {

    const query = {
        where: {
            share_holder_id: shareHolderId
        },
        limit: limit,
        attributes: ["ticker"]
    }

    return query;
}

module.exports = liked_tickers;