const stocks = require('express').Router();

const axios = require('axios');

const { updateTickerCounterGlobal } = require('../../redis/global_redis_utils')
const { updateTickerCounterUser } = require('../../redis/user_redis_utils')

const { getHistoryTicker } = require('../../utils/history_manager')

stocks.get("/:ticker", getHistoryByTicker);

async function getHistoryByTicker(req, res) {    

    const ticker = req.params.ticker;
    const period = req.query.period ?? '1d'    
    // user must explicitly states that he doesn't want the analytics on 
    const update_analytics = req.query.update_analytics ?? true

    getHistoryTicker(ticker, period).then(result => {
        updateTickerCounters(ticker, req);
        res.status(200).send(JSON.stringify(result))
    }).catch(err => {        
        res.status(500).send(err)
    })
};

async function updateTickerCounters(ticker, req){
    updateTickerCounterGlobal(ticker);
    // only if logged
    if(req.session.user) updateTickerCounterUser(req.session.user.email, ticker);
}

module.exports = stocks;