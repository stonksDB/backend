const express = require('express');
const session = require('express-session');

const routes = express.Router();

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
        sameSite: 'strict'
    },
    store: sessionStore,
    resave: true
}))

const stocks = require('./stocks')
const news = require('./news');
const search = require('./search')
const auth = require('./auth');
const landpage = require('./landpage');
const user = require('./user');

routes.use('/stocks', stocks)
routes.use('/news', news)
routes.use('/search', search)
routes.use('/auth', auth)
routes.use('/landpage', landpage)
routes.use('/user', user)

routes.get('/info', (req, res) => {
    if(!req.session)
        return res.status(400).send(`No session associated!`);
    const sess = JSON.stringify(req.session);
    const sess_id = JSON.stringify(req.session.id);
    const sess_cookie = JSON.stringify(req.session.cookie);
    const output = `req.session: ${sess}\n\nreq.session.id: ${sess_id}\n\nreq.session.cookie: ${sess_cookie}`
    return res.status(200).send(`Current session info: ${output}`);
});

routes.get('/session_all', (req, res) => {
    return sessionStore.all((error,sessions) =>{
        let sess_str = ''
        sessions.forEach(sess => sess_str += '\n' + JSON.stringify(sess));
        res.status(200).send(`Returned list of sessions: ${sess_str}`);
    })
});

module.exports = routes;