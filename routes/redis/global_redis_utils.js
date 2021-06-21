const redis = require('redis');

// client for interaction
const client = redis.createClient({
    host: '25.68.176.166',
    port: 6379,
    db: 2
});

/**
 * Given a string update the count of that ticker
 * @param {String} ticker - ticker for which to update the counter
 */
exports.update_ticker_counter_global = (ticker) => {
    return client.zscore("ticker_set", ticker, function (err, res) {
        if (err) console.log(err)

        let value = 1        

        
        if(res){//if the ticker is already there
            value = (parseInt(res) + 1)
        }

        args = ["ticker_set", value, ticker]

        client.zadd(args, function (err) {
            if(err) console.log(err)
        })
    })
}