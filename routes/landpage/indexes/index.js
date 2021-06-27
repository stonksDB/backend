const indexes = require('express').Router();

const { getHistoryTicker } = require('../../utils/history/data_retriever')
const index_list_json = require('./indexes_list.json')

/**
 * returns a JSON object in the format {'index' : '<index_prices_info>'}
 */
indexes.get('/', (_, res) => {

    // list of Promise Response returned by the 'getHistoryTicker' function (NOT NEEDED)
    const pending_responses = []

    index_list_json.forEach(index => {
        // '1d' since index data of interest only in the last day
        // '15m' more rare data - reduce size of response
        pending_responses.push(getHistoryTicker(index.ticker, '1d', "15m"))
    });
    
    Promise.all(pending_responses).then(indexes_data => {        

        for(var i = 0; i < indexes.length; i++){
            index_list_json[i]["points"] = indexes_data[i]
        }
        
        res.status(200).json(index_list_json)

    }).catch(err => { return res.status(500).send(err) })

});

module.exports = indexes;