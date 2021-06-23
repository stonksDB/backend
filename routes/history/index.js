const stocks = require('express').Router();
const baseUrl = "25.68.176.166"

const axios = require('axios');
const redis = require("redis");
const client = redis.createClient();

const { updateTickerCounterGlobal } = require('../redis/global_redis_utils')
const { updateTickerCounterUser } = require('../redis/user_redis_utils')

stocks.get("/:ticker", getHistoryByTicker);

async function getHistoryByTicker(req, res) {    

    const ticker = req.params.ticker;
    const period = req.query.period ?? '1d'    

    updateTickerCounterGlobal(ticker);
    console.log(req.session)
    if(req.session.user) updateTickerCounterUser(req.session.user.email, ticker);

    //check
    console.log("Received ticker: " + ticker);
    axios.defaults.port = 5000;
    axios.get("http://"+ baseUrl +":5000/history/" + ticker, { params: { "period": period } })
        .then(resP => {
            console.log("res", resP)
            res.send(resP.data)
        })
        .catch(error => {
            console.log("err", error)
            res.send(error)            
        });

};

module.exports = stocks;