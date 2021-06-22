var express = require('express');

var router = express.Router();

const { models } = require('../../sequelize');


router.get('/indexes', indexesData);
router.get('/most_performing', mostPerformingData);
router.get('/likes', likedStockData);

async function indexesData(req, res) {

    res.send([{ ticker: "^GSPC", name: "S&P 500" }, { ticker: "^DJI", name: "Dow 30	" }, { ticker: "^IXIC", name: "Nasdaq" }, { ticker: "FTSEMIB.MI", name: "FTSE MIB Index" }, { ticker: "^XAX", name: "NYSE AMEX COMPOSITE INDEX" }, { ticker: "^RUT", name: "Russell 2000" }, { ticker: "^BUK100P", name: "Cboe UK 100" },])

}

async function mostPerformingData(req, res) {

    const rows = await models.stock.findAll({
        order: [
            ['ratio', 'DESC']
        ],
        attributes: ["ticker", "name"],
        limit: 4,
    })

    res.send(rows)

}

async function likedStockData(req, res) {

    //1) search for follows
    const rows = await models.like.findAll({
        where: {
            share_holder_id: 13
        },
        limit: 4,
        attributes: ["ticker"]
    })

    res.status(200).send(rows.map(t => t.get("ticker")))
}

module.exports = router;