const redis = require('redis');
const config = require('./../../../config/config.json')

const USER_ANALYTICS_DB = 1;

// returns a redisClient instance to interact with the database
redisClient = redis.createClient({
    host: config.host,
    port: 6379, // default redis port
    db: USER_ANALYTICS_DB
});

/**
 * 
 * @param {String} user - email associated to the logged user
 * @returns - empty string if entry does not exist, JSON string if key matches
 */
exports.getUserAnalytics = async (user) => {

    const email = user;

    return new Promise((resolve, reject) => {

        const filteringArgs = ["+inf", "-inf", "LIMIT", "0", "5"]

        redisClient.zrevrangebyscore(email, filteringArgs, (err, res) => {
            if (err)
                reject(err)
            else
                resolve(res)
        });
    });

}

/**
 * Given an email and a string, stores it to support analytics
 * @param {String} user - email associated to the logged user
 * @param {String} ticker - ticker for which to update the counter
 * @returns 
 */
exports.updateTickerCounterUser = async (user, ticker) => {

    const email = user;

    return redisClient.zscore(email, ticker, (err, prevCounter) => {
        if (err)
            console.error(err) // log as error priority

        let counter = 1;

        console.log(`Previous counter value for ${ticker}: ${prevCounter}`)

        if (prevCounter) { // ticker already in the set
            counter = (parseInt(prevCounter) + 1)
        }

        const filteringArgs = [email, counter, ticker]

        redisClient.zadd(filteringArgs, (err) => {
            if (err)
                console.error(err);
        });
    });
}