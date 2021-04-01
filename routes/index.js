const routes = require('express').Router();

const stocks = require('./stocks')
const history = require('./history')

routes.use('/stocks', stocks)
routes.use('/history', history)


routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected! Working!' });
});

module.exports = routes;