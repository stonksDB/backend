const redis = require('redis');
const config = require('./../../../config/config.json')

const GLOBAL_ANALYTICS_DB = 2;

// returns a redisClient instance to interact with the database
exports.redisClient = redis.createClient({
    host: config.host,
    port: 6379, // default redis port
    db: GLOBAL_ANALYTICS_DB
});

