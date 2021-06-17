/**
 * This file contains a mock up to show how the functions get and update should be used
 */

const user_analytics = require('express').Router();

const { get_user_analytics, update_ticker_counter } = require('./analytics_util')

user_analytics.get('/insert', (req, res) => {
    const { ticker, email } = req.body;
    update_ticker_counter(email, ticker);
    
    get_user_analytics(email, (value) => { return res.status(200).send(`Found: ${value}`)});
  });

  user_analytics.get("/get", (req, res) => {
    const { email } = req.body;
    
    get_user_analytics(email, (value) => { return res.status(200).send(`Found: ${JSON.stringify(value)}`)});
})

module.exports = user_analytics;