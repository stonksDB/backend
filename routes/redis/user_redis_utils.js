const redis = require('redis');

// client for interaction
const client = redis.createClient({
    host: '25.68.176.166',
    port: 6379,
    db: 1
});

const empty_json_str = "{}";

/**
 * 
 * @param {String} key - email associated to the logged user
 * @returns - empty string if entry does not exist, JSON string if key matches
 */
exports.get_user_analytics = async (key) => {

    return new Promise((resolve, reject) => {
        client.get(key, (error, value) => {
            if (error)          
                reject(error)
            if(value === null){ // no key present for the user
                resolve({})
            }            
            else // parse the data already present
                resolve(JSON.parse(value))
        })
    });

}

/**
 * Given an email and a string, stores it to support analytics
 * @param {String} user - email of the user 
 * @param {String} ticker - ticker for which to update the counter
 * @returns 
 */
exports.update_ticker_counter_user = async (user, ticker) => {

    this.get_user_analytics(user).then(json_obj => {
        if (json_obj[ticker]) {
            let counter = json_obj[ticker]
            json_obj[ticker] = counter + 1 // increment
        }
        else {
            json_obj[ticker] = 1 // create new attribute
        }

        // store back value
        client.set(user, JSON.stringify(json_obj));
    }).catch(err => console.log("error", err))

}