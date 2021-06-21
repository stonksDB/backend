const stocks = require('express').Router();
const baseUrl = "25.68.176.166"

const axios = require('axios')
const redis = require("redis");
const client = redis.createClient();

const { update_ticker_counter_global } = require('../redis/global_redis_utils')
const { update_ticker_counter_user } = require('../redis/user_redis_utils')

stocks.get("/:ticker", getHistoryByTicker);

async function getHistoryByTicker(req, res) {    

    const ticker = req.params.ticker;
    const period = req.query.period ?? '1d'    

    update_ticker_counter_global(ticker);
    if(req.session.user.email) update_ticker_counter_user(req.session.user.email, ticker);

    //check
    console.log("Received ticker: " + ticker);
    axios.defaults.port = 5000;
    axios.get("http://" + baseUrl + ":5000/history/" + ticker, { params: { "period": period } })
        .then(resP => {
            console.log("res", resP)
            res.send(resP.data)
        })
        .catch(error => {
            res.send(error)            
        });

};

module.exports = stocks;