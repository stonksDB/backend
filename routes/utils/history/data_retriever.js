const axios = require('axios');
const config = require('../../../config/config.json')


/**
 * Given a string update the count of that ticker
 * @param {String} ticker - ticker for which to update the counter
 */

exports.getHistoryTicker = (ticker, period = "1d", interval = "1m") => {

    // returns promise instance containing the price data
    return new Promise((resolve, reject) => {

        axios.defaults.port = 5000;
        axios.get("http://" + config.host + ":" + 5000 + "/history/" + ticker, { params: { "period": period, "interval": interval } })
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error);
            });
    })

}