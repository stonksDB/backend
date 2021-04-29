const routes = require('express').Router();

const stocks = require('./stocks')
const history = require('./history');
const news = require('./news');
const search = require('./search')
const company = require('./company')
const { Router } = require('express');

routes.use('/stocks', stocks)
routes.use('/history', history)
routes.use('/news', news)
routes.use('/search', search)
routes.use('/company', company)

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;