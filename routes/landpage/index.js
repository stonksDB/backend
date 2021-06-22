var express = require('express');

var router = express.Router();

const { models } = require('../../sequelize');


router.get('/indexes', indexesData);
router.get('/most_performing', mostPerformingData);
router.get('/likes', likedStockData);

async function indexesData(req, res) {

    res.send(["^GSPC", "^DJI", "^IXIC", "^NYA", "^XAX", "^RUT", "^BUK100P"])

}

async function mostPerformingData(req, res) {   
    
}

async function likedStockData(req, res) {

    //1) search for follows
    const rows = await models.like.findAll({
        where: {
            //TODO
            share_holder_id: 13
        },
        limit: 4,
        attributes: ["ticker"]
    })

    res.status(200).send(rows.map(t => t.get("ticker")))
}

module.exports = router;