const stocks = require('express').Router();

const axios = require('axios');

const { updateTickerCounterGlobal } = require('../../utils/redis/global_redis_utils')
const { updateTickerCounterUser } = require('../../utils/redis/user_redis_utils')

const { getHistoryTicker } = require('../../utils/history/data_retriever')

stocks.get("/:ticker", getHistoryByTicker);

async function getHistoryByTicker(req, res) {

    const ticker = req.params.ticker;
    const period = req.query.period ?? '1d'
    // user must explicitly states that he doesn't want the analytics on
    const analytics_should_be_updated = req.query.update_analytics ?? true

    getHistoryTicker(ticker, period).then(result => {

        if (analytics_should_be_updated)
            updateTickerCounters(req.session.user, ticker)        

        res.status(200).send(JSON.stringify(result))

    }).catch(err => {
        res.status(500).send(err)
    })
};

function updateTickerCounters(user_info, ticker) {    
    updateTickerCounterGlobal(ticker)    
    // if user info available -> user logged
    if (user_info) {
        updateTickerCounterUser(user_info.email, ticker);
    }
}

module.exports = stocks;