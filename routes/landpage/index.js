var express = require('express');

var router = express.Router();

const { models } = require('../../sequelize');
const { getHistoryTicker } = require('../utils/history_manager')


router.get('/indexes', indexesData);
router.get('/most_performing', mostPerformingData);
router.get('/likes', likedStockData);

async function indexesData(req, res) {
    // temporary turn aroung to retrieve data in sequential order
    return getIndexesDataSequential(req, res);
    //const indexes = [{ ticker: "TSLA", name: "S&P 500" }, { ticker: "FTSEMIB.MI", name: "Borsa di Milano" }]
    let indexes = [{ ticker: "^GSPC", name: "S&P 500" }, { ticker: "^DJI", name: "Dow 30	" }, { ticker: "^IXIC", name: "Nasdaq" }, { ticker: "FTSEMIB.MI", name: "FTSE MIB Index" }, { ticker: "^XAX", name: "NYSE AMEX COMPOSITE INDEX" }, { ticker: "^RUT", name: "Russell 2000" }, { ticker: "^BUK100P", name: "Cboe UK 100" }]

    //const indexes = [{ ticker: '^RUT', name: "Russell 2000" }, { ticker: '^GSPC', name: "S&P 500" }]

    const promises = []

    // getHistoryTicker(indexes[1].ticker, '1d').then(result => {
    //     console.log(result)
    //     res.send(result)
    // }).catch(err => console.log(err))

    // create list of promises to retrieve the index data
    indexes.forEach(element => {

        console.log(element.ticker)

        promises.push(getHistoryTicker(element.ticker, '1d'))

    });

    Promise.all(promises).then(values => {

        for(var i = 0; i < indexes.length; i++){
            indexes[i]["points"] = values[i]
        }

        res.send(indexes)

    }).catch(err => { 
        console.log(err)    
        console.log("there was an error")  
        res.status(500).send(err)
    })

}

async function getIndexesDataSequential(req, res) {
    return "";
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