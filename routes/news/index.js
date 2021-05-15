const news = require('express').Router();
const { models } = require('../../sequelize');
const { Op } = require('sequelize');

const axios = require('axios')

news.get("/:ticker", getNewsByTicker);

async function getNewsByTicker(req, res) {

    const ticker = req.params.ticker;

    var options = {
        method: 'POST',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/v2/list',
        params: {s:ticker, region: 'IT', snippetCount: '5'},
        headers: {
          'content-type': 'text/plain',
          'x-rapidapi-key': 'Dzzd2zsPGXmshEw7W0fIiNYZklJZp1ebqsmjsnrFbX2oNhRmND',
          'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        },
      };

    axios.request(options).then(function (response) {

        let results = []

        response.data.data.main.stream.forEach(element => {
            const smallElem = {
                "uuid": element.id,
                "title": element.content.title,
                "img": element.content.thumbnail.resolutions[0] ?? "",
                "published_at": element.content.pubDate,
            }

            results.push(smallElem)
        });

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