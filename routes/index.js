const routes = require('express').Router();

const stocks = require('./stocks')

routes.use('/stocks', stocks)

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;