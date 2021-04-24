const stocks = require('express').Router();
const baseUrl = "127.0.0.1:5000"
//const baseUrl = "25.68.176.166"

const axios = require('axios')

stocks.get("/:ticker", getHistoryByTicker);

async function getHistoryByTicker(req, res) {

    const ticker = req.params.ticker;
    const from = req.query.from ?? Date.now() - 8640000
    const to = req.query.to ?? Date.now()
    const period = req.query.period ?? 'd'

    var fromDate = new Date(from).toISOString().slice(0, 10);
    var toDate = new Date(to).toISOString().slice(0, 10);

    const options = {
        baseUrl: baseUrl,
        method: 'get',
        url: '/history',
    }

    axios.defaults.port = 5000;
    axios.get("http://localhost:5000/history", { params: { req } })
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