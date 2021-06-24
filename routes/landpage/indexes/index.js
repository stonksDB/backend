const indexes = require('express').Router();

const { getHistoryTicker } = require('../../utils/history/data_retriever')
const index_list_json = require('./indexes_list.json')

/**
 * returns a JSON object in the format {'index' : '<index_prices_info>'}
 */
indexes.get('/', (_, res) => {
    // load list of indexes from support file
    const index_list = JSON.parse(index_list_json)

    // list of Promise Response returned by the 'getHistoryTicker' function
    const pending_responses = []

    indexes.forEach(index => {
        // '1d' since index data of interest only in the last day
        // '15m' more rare data - reduce size of response
        pending_responses.push(getHistoryTicker(index.ticker, '1d', "15m"))
    });

    // wait until all data returned
    Promise.all(pending_responses).then(indexes_data => {

        for(var i = 0; i < indexes.length; i++){
            index_list[i]["points"] = indexes_data[i]
        }

        // returns in JSON format
        res.statur(200).json(indexes)

    }).catch(err => { return res.status(500).send(err) })

});

module.exports = indexes;