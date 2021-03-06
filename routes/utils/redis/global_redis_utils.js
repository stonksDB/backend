const redis = require('redis');
const config = require('./../../../config/config.json')

const GLOBAL_ANALYTICS_DB = 2;
const TICKER_COUNTERS = 'ticker_set';

// returns a redisClient instance to interact with the database
const globalRedisClient = redis.createClient({
    host: config.host,
    port: 6379, // default redis port
    db: GLOBAL_ANALYTICS_DB
});

/**
 * 
 * @returns the ordered set of most liked tickers among the user of the application
 */
exports.getMostSearchedTickers = (limit) => {
    // callback function on Promise evaluation
    return new Promise((resolve, reject) => {

        console.log(limit)

        const filteringArgs = ["+inf", "-inf", "LIMIT", "0", limit]

        console.log(filteringArgs)

        globalRedisClient.zrevrangebyscore(TICKER_COUNTERS, filteringArgs, (err, res) => {
            if (err)
                reject(err)
            else {
                console.log(res)
                resolve(res)
            }
        });
    });
}

/**
 * Given a string update the count of that ticker
 * @param {String} ticker - ticker for which to update the counter
 */
exports.updateTickerCounterGlobal = (ticker) => {
    return globalRedisClient.zscore(TICKER_COUNTERS, ticker, (err, prevCounter) => {
        if (err)
            console.error(err) // log as error priority

        let counter = 1;

        if (prevCounter) { // ticker already in the set
            counter = (parseInt(prevCounter) + 1)
        }

        const filteringArgs = [TICKER_COUNTERS, counter, ticker]

        globalRedisClient.zadd(filteringArgs, (err) => {
            if (err)
                console.error(err);
        });
    });
}