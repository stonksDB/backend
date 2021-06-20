const stocks = require('express').Router();
const baseUrl = "127.0.0.1:5000"
//const baseUrl = "25.68.176.166"

const axios = require('axios')

stocks.get("/:ticker", getHistoryByTicker);

async function getHistoryByTicker(req, res) {

    const ticker = req.params.ticker;
    const period = req.query.period ?? '1d'

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

module.exports = stocks;