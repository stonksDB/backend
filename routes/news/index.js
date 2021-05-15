const news = require('express').Router();
const { models } = require('../../sequelize');
const { Op } = require('sequelize');

const axios = require('axios')

news.get("/:ticker", getNewsByTicker);

async function getNewsByTicker(req, res) {

    const ticker = req.params.ticker;

    var options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/list',
        params: {category: ticker, region: 'IT', start_uuid:'d'},
        headers: {
          'x-rapidapi-key': 'Dzzd2zsPGXmshEw7W0fIiNYZklJZp1ebqsmjsnrFbX2oNhRmND',
          'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
      };

    axios.request(options).then(function (response) {

        let results = []

        for (var i = 0; i < 5; i++){

            const element = {
                "uuid": response.data.items.result[i].uuid,
                "title": response.data.items.result[i].title,
                "summary": response.data.items.result[i].summary,
                "author": response.data.items.result[i].title,
                "img": response.data.items.result[i].main_image.resolutions[0] ?? "",
                "publicshed_at": response.data.items.result[i].published_at,
            }

            results.push(element)
        }

        res.send(results)

    }).catch(function (error) {
        console.error(error);
    });

    //ERRORS
    // server does not respond
    // no data found
    // other

};

module.exports = news;