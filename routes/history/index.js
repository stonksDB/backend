const stocks = require('express').Router();
var yf = require('yahoo-finance');

stocks.get("/:ticker", getHistoryByTicker);

async function getHistoryByTicker(req, res) {

    const ticker = req.params.ticker;
    const from = req.query.from ?? 0
    const to = req.query.to ?? Date.now()

    console.log(ticker)

    yf.historical({
        symbol: ticker,
        from: '2012-01-01',
        to: '2012-12-31',
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