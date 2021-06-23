const liked_tickers = require('express').Router();

const sequelize = require('../../../sequelize');

/**
 * returns a JSON array [{"ticker" : {<price_values>}]
 */
 liked_tickers.get('/', (req, res) => {
    const LIMIT = req.query.limit ?? 4; // 4 is default value

    if (req.session.user.email) // user logged in
        sequelize.models.like.findAll({
            where: {
                share_holder_id: req.session.user.share_holder_id
            },
            limit: LIMIT,
            attributes: ["ticker"]
        }).then(result => { 
            //res.status(200).send(JSON.stringify(toArray('ticker', result)))
            res.status(200).send(JSON.stringify(result))
        })
        .catch(err => { res.status(400).send(JSON.stringify(err))})
    else
        // unauthorized
        res.sendStatus(400);
});

// transforms the db result into array - given the attribute to be selected
const toArray = (attr, dbResult) => {
    return dbResult.map(dbRow => dbRow.get(attr))
}

module.exports = liked_tickers;