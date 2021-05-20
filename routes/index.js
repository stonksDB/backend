const express = require('express');
const session = require('express-session');

const routes = express.Router();
const app = express();

const redis = require('redis');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();
let sessionStore = new RedisStore({ client: redisClient, ttl: 86400 }); // ttl - expires after 24h of inutilization

// middleware: for every request attaches data from redis - access through req.session
routes.use(session({
    secret: 'our-awesome-secrete',
    name: "this-should-be-secret",
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: true,
    },
    store: sessionStore,
    resave: false
}))

const stocks = require('./stocks')
const history = require('./history');
const news = require('./news');
const search = require('./search')
const company = require('./company')
const auth = require('./auth');
const { stringify, str } = require('ajv');

const sequelize = require('./../sequelize');

routes.use('/stocks', stocks)
routes.use('/history', history)
routes.use('/news', news)
routes.use('/search', search)
routes.use('/company', company)
routes.use('/auth', auth)

routes.get('/info', (req, res) => {
    if(!req.session)
        return res.status(400).send(`No session associated!`);
    const sess = stringify(req.session);
    const sess_id = stringify(req.session.id);
    const sess_cookie = stringify(req.session.cookie);
    const output = `req.session: ${sess}\n\nreq.session.id: ${sess_id}\n\nreq.session.cookie: ${sess_cookie}`
    return res.status(200).send(`Current session info: ${output}`);
});

routes.get('/session_all', (req, res) => {
    return redisClient.keys("sess:*", function(error, keys){
        const str_keys = stringify(keys);
        return res.status(200).send(`Current active sessions: ${str_keys}`);
    });
});

module.exports = routes;