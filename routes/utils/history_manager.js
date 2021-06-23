const axios = require('axios');
const config = require('../../config/config.json')


/**
 * Given a string update the count of that ticker
 * @param {String} ticker - ticker for which to update the counter
 */

exports.getHistoryTicker = (ticker, period) => {

    console.log("called")

    return new Promise((resolve, reject) => {

        axios.defaults.port = 5000;
        axios.get("http://" + config.host + ":5000/history/" + ticker, { params: { "period": period } })
            .then(resP => {                
                resolve(resP.data)
            })
            .catch(error => {
                console.log(ticker, error)
                reject(error);
            });
    })

}