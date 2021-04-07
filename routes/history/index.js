const stocks = require('express').Router();
var yf = require('yahoo-finance');

stocks.get("/:ticker", getHistoryByTicker);

async function getHistoryByTicker(req, res) {

    const ticker = req.params.ticker;
    const from = req.query.from ?? 0
    const to = req.query.to ?? Date.now()    

    var fromDate = new Date(from).toISOString().slice(0, 10);
    var toDate = new Date(to).toISOString().slice(0, 10);

    console.log(new Date(from).toISOString())

    yf.historical({
        symbol: ticker,
        from: fromDate,
        to: toDate,
        period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    }, function (err, quotes) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).json(quotes);
        }
    });
};

module.exports = stocks;