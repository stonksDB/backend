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

module.exports = company;