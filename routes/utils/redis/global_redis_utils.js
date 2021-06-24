const { redisClient } = require('./redis_client') // interact with redis

const TICKER_COUNTERS = 'ticker_set';

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