const stocks = require('express').Router();

const axios = require('axios');
const config = require('../../../config/config.json')

const { updateTickerCounterGlobal } = require('../../redis/global_redis_utils')
const { updateTickerCounterUser } = require('../../redis/user_redis_utils')

stocks.get("/:ticker", getHistoryByTicker);

async function getHistoryByTicker(req, res) {    

    const ticker = req.params.ticker;
    const period = req.query.period ?? '1d'    
    
    // user must explicitly states that he doesn't want the analytics on 
    const update_analytics = req.query.update_analytics ?? true

    axios.defaults.port = 5000;
    axios.get("http://" + config.host + ":5000/history/" + ticker, { params: { "period": period } })
        .then(resP => {
            res.status(200).send(JSON.stringify(resP.data))

            // update only if data returned successfully and user desire it
            if(update_analytics)
                update_ticker_counters()
            else 
                return;
        })
        .catch(error => {
            res.status(500).send(error);         
        });
};

async function update_ticker_counters(){
    updateTickerCounterGlobal(ticker);

    // only if logged
    if(req.session.user) updateTickerCounterUser(req.session.user.email, ticker);
}

module.exports = stocks;