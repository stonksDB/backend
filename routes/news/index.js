const news = require('express').Router();
const { models } = require('../../sequelize');
const { Op } = require('sequelize');

const fs = require('fs');

const axios = require('axios')

news.get("/:ticker", getNewsByTicker);
news.get("/single/:uuid", getSingleNewsByUuid);

async function getNewsByTicker(req, res) {

    const ticker = req.params.ticker;
    const number = req.query.number ?? 5;

    console.log(number)

    var options = {
        method: 'POST',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/v2/list',
        params: { s: ticker, region: 'IT', snippetCount: number },
        headers: {
            'content-type': 'text/plain',
            'x-rapidapi-key': 'Dzzd2zsPGXmshEw7W0fIiNYZklJZp1ebqsmjsnrFbX2oNhRmND',
            'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        },
    };

    axios.request(options).then(function (response) {

        let results = []

        let data = JSON.stringify(response.data.data.main.stream);
        fs.writeFileSync('student-2.json', data);

        response.data.data.main.stream.forEach(element => {
            const smallElem = {
                "uuid": element.id,
                "title": element.content.title,
                "img": element.content.thumbnail.resolutions[0] ?? "",
                "published_at": element.content.pubDate,
                "provider": element.content.provider.displayName
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

async function getSingleNewsByUuid(req, res) {

    const uuid = req.params.uuid;

    var options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/v2/get-details',
        params: { uuid: uuid, region: 'IT' },
        headers: {
            'x-rapidapi-key': 'Dzzd2zsPGXmshEw7W0fIiNYZklJZp1ebqsmjsnrFbX2oNhRmND',
            'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        res.send(response.data)        
    }).catch(function (error) {
        res.send(error)        
    });

};

module.exports = news;