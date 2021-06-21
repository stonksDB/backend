const redis = require('redis');

// client for interaction
const client = redis.createClient({
    host: '25.68.176.166',
    port: 6379,
    db: 0
});

const analytics_db = 1;
const empty_json_str = "{}";

/**
 * 
 * @param {String} key - email associated to the logged user
 * @param {Function} callback - executed with returned value
 * @returns - empty string if entry does not exist, JSON string if key matches
 */
exports.get_user_analytics = (key, callback) => {
    return client.select(analytics_db, (err, res) => {
        if(err)
            console.log(err)
        else
            return client.get(key, (error, value) => {
                let json_obj;
                if (error || value === null)  // no key present for the user
                    json_obj = JSON.parse(empty_json_str);
                else // parse the data already present
                    json_obj = JSON.parse(value)
            
                callback(json_obj);
            })
    })
}

/**
 * Given an email and a string, stores it to support analytics
 * @param {String} user - email of the user 
 * @param {String} ticker - ticker for which to update the counter
 * @returns 
 */
exports.update_ticker_counter = (user, ticker) => {
    return client.select(analytics_db, (err, _) => {
        if(err)
            console.log(err);
        // successfully selected the db
        else 
            return this.get_user_analytics(user, (json_obj) => {
                if (json_obj[ticker]) {
                    let counter = json_obj[ticker]
                    json_obj[ticker] = counter + 1 // increment
                }
                else {
                    json_obj[ticker] = 1 // create new attribute
                }
                
                // store back value
                client.set(user, JSON.stringify(json_obj));
            });
    })
}

/**
 * Update number of searches for particular ticker
 * @param {String} user - email of the user 
 * @param {String} ticker - ticker for which to update the counter
 * @returns 
 */
 exports.update_ticker_counter = (ticker) => {
    return client.select(analytics_db, (err, _) => {
        if(err)
            console.log(err);
        // successfully selected the db
        else 
            return this.get_user_analytics(user, (json_obj) => {
                if (json_obj[ticker]) {
                    let counter = json_obj[ticker]
                    json_obj[ticker] = counter + 1 // increment
                }
                else {
                    json_obj[ticker] = 1 // create new attribute
                }
                
                // store back value
                client.set(user, JSON.stringify(json_obj));
            });
    })
}
