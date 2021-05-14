const routes = require('express').Router();

const register = require('./register')
const login = require('./login')
const logout = require('./logout')

/**
 * This comment aims to clarify how the session based authentication and authorization is used for this two access points.
 * -- REGISTER --
 * To access this endpoint the incoming request must not have an email associated. Otherwise, it means that the user is already
 * logged in, but for a logged user, there is no mean to register another account
 * 
 * -- LOGIN -- 
 * For a user already logged, this access point is useless, cause it doesn't provide any additional functionality. Therefore, 
 * in this situation must the request be not processed and return immediatly to the user.
 */

routes.use('/register', register)
routes.use('/login', login)
routes.use('/logout', logout)

module.exports = routes;