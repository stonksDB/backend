const price = require('express').Router();
const sequelize = require('./../../../sequelize')

price.get("/:ticker", (req, res) => {
  const ticker = req.params.ticker 
  
  if (ticker == "")
    return res.sendStatus(400)
  
    // through sequelize get ticker, price and last_update values
  sequelize.models.stock.findOne({
    where: {
      ticker : ticker
    },
    attributes: ['ticker', 'regular_market_price', 'price_last_update', 'ratio']
  }).then(result => { 
    if (result) 
      return res.status(200).send(JSON.stringify(result));
    else 
      return res.sendStatus(400);
    })
  .catch(error => { return res.status(500).send(JSON.stringify(error)) });
});

module.exports = price;