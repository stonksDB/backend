const routes = require('express').Router();

const stocks = require('./stocks')
const history = require('./history');
const news = require('./news');
const search = require('./search')
const company = require('./company')
const auth = require('./auth')

routes.use('/stocks', stocks)
routes.use('/history', history)
routes.use('/news', news)
routes.use('/search', search)
routes.use('/company', company)
routes.use('/auth', auth)

module.exports = routes;