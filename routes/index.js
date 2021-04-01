const routes = require('express').Router();

const stocks = require('./stocks')
const history = require('./history');
const news = require('./news')

routes.use('/stocks', stocks)
routes.use('/history', history)
routes.use('/news', news)

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;