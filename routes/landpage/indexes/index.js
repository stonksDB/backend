const indexes = require('express').Router();

const sequelize = require('./../../../sequelize')
const { getHistoryTicker } = require('../../utils/history/data_retriever')
const index_list_json = require('./indexes_list.json')

/**
 * returns a JSON object in the format {'index' : '<index_prices_info>'}
 */
indexes.get('/', (_, res) => {

    // list of Promise Response returned by the 'getHistoryTicker' function (NOT NEEDED)
    const pending_responses = []

    index_list_json.forEach(index => {
        // '1d' since index data of interest only in the last day
        // '15m' more rare data - reduce size of response
        pending_responses.push(getHistoryTicker(index.ticker, '1d', "15m"))
    });
    
    Promise.all(pending_responses).then(indexes_data => {   
            

        for(var i = 0; i < index_list_json.length; i++){            
            index_list_json[i]["points"] = indexes_data[i]
        }
        
        res.status(200).json(index_list_json)

    }).catch(err => { return res.status(500).send(err) })

});

async function getHistoryByTicker(req, res) {

    const ticker = req.params.ticker;
    const period = req.query.period ?? '1d'

    getHistoryTicker(ticker, period).then(result => {

        res.status(200).send(JSON.stringify(result))

    }).catch(err => {
        res.status(500).send(err)
    })
};

/* returns current price for the given ticker */ 
indexes.get("/index_price/:ticker", (req, res) => {
    const ticker = req.params.ticker 
    
    if (ticker == "")
      return res.sendStatus(400)
    
    // through sequelize get ticker, price and last_update values
    sequelize.models.index.findOne({
      where: {
        ticker : ticker
      },
      attributes: ['ticker', 'regular_market_price', 'price_last_update', 'ratio']
    }).then(result => { 
      if (result) 
        return res.status(200).send(JSON.stringify(result));
      else 
        return res.sendStatus(400);
      })
    .catch(error => { return res.status(500).send(JSON.stringify(error)) });
});

module.exports = indexes;