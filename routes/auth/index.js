const routes = require('express').Router();

const register = require('./register')
const login = require('./login')

routes.use('/register', register)
routes.use('/login', login)

module.exports = routes;