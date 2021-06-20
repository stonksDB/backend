/**
 * returns the information about the company associated with the :ticker provided
 */
const company = require('express').Router();
const sequelize = require('./../../sequelize');

company.get("/all", (_, res) => { 
   // load companies from db - query the companies view created
   sequelize.models.company.findAll().then(companies => { return res.status(200).send(JSON.stringify(companies)) })
      .catch(err => { return res.status(400).send(JSON.stringify(err))});
});

company.get("/single/:ticker", (req, res) => {
   const ticker = req.params.ticker;

   sequelize.models.company.findOne(
      {
         where:{
            ticker: ticker
         }
      }).then(cmp => { 
         if(!cmp) // no company matching the ticker provided
            return res.status(400).send("Invalid Ticker");
         else
            return res.status(200).send(JSON.stringify(cmp)) 
      }).catch(_ => { return res.status(500).send('Error on database read!') })
})

module.exports = company;