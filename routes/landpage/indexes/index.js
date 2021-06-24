const indexes = require('express').Router();

const sequelize = require('../../../sequelize');
const { getHistoryTicker } = require('../../utils/history_manager')

/**
 * returns the list of indexes with their data
 */
indexes.get('/indexes', indexesData);


async function indexesData(req, res) {

    let indexes = [{ ticker: "^GSPC", name: "S&P 500" }, { ticker: "^DJI", name: "Dow 30" }, { ticker: "^IXIC", name: "Nasdaq" }, { ticker: "FTSEMIB.MI", name: "FTSE MIB Index" }, { ticker: "^HSI", name: "Hang Seng Index" },  { ticker: "^XAX", name: "NYSE AMEX COMPOSITE INDEX" }]


    //^

    const promises = []

    indexes.forEach(element => {

        console.log(element.ticker)

        promises.push(getHistoryTicker(element.ticker, '1d', "15m"))

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

module.exports = indexesData;