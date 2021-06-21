const stocks = require('express').Router();
const baseUrl = "127.0.0.1:5000"
//const baseUrl = "25.68.176.166"

const axios = require('axios')
const redis = require("redis");
const client = redis.createClient();

stocks.get("/:ticker", getHistoryByTicker);

async function getHistoryByTicker(req, res) {    

    const ticker = req.params.ticker;
    const period = req.query.period ?? '1d'

    addSearchToRedis(ticker);

    //check
    console.log("Received ticker: " + ticker);
    axios.defaults.port = 5000;
    axios.get("http://localhost:5000/history/" + ticker, { params: { "period": period } })
        .then(resP => {
            console.log(resP)
            res.send(resP.data)
        })
        .catch(error => {
            res.send(error)
            console.log();
        });

};

function addSearchToRedis(ticker){
    client.zscore("ticker_set", ticker, function(err, res) {
        if(err) console.log(err)

        console.log("res: ",res)
        args = ["ticker_set", (parseInt(res) + 1), ticker]

        client.zadd(args, function(err, res){
            console.log(res)
        })

    })
    
}

module.exports = stocks;