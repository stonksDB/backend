const redis = require('redis');
const config = require('./../../../config/config.json')

const GLOBAL_ANALYTICS_DB = 2;
const TICKER_COUNTERS = 'ticker_set';

// returns a redisClient instance to interact with the database
exports.redisClient = redis.createClient({
    host: config.host,
    port: 6379, // default redis port
    db: GLOBAL_ANALYTICS_DB
});

/**
 * 
 * @returns the ordered set of most liked tickers among the user of the application
 */
exports.getMostSearchedTickers = () => {
    // callback function on Promise evaluation
    return new Promise((resolve, reject) => {

        const filteringArgs = ["+inf", "-inf", "LIMIT", "0", "5"]

        redisClient.zrevrangebyscore(TICKER_COUNTERS, filteringArgs, (err, res) => {
            if (err)
                reject(err)
            else
                resolve(res)
        });
    });
}

/**
 * Given a string update the count of that ticker
 * @param {String} ticker - ticker for which to update the counter
 */
exports.updateTickerCounterGlobal = (ticker) => {
    return redisClient.zscore(TICKER_COUNTERS, ticker, (err, prevCounter) => {
        if (err)
            console.error(err) // log as error priority

        let counter = 1;

        if (prevCounter) { // ticker already in the set
            counter = (parseInt(prevCounter) + 1)
        }

        const filteringArgs = [TICKER_COUNTERS, counter, ticker]

        redisClient.zadd(filteringArgs, (err) => {
            if (err)
                console.error(err);
        });
    });
}