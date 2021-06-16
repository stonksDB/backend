const news = require('express').Router();
const { models } = require('../../sequelize');
const { Op } = require('sequelize');

const fs = require('fs');

const axios = require('axios')
news.get('/', getNewsPersonalized)
news.get("/:ticker", getNewsByTickerRequestHandler);
news.get("/single/:uuid", getSingleNewsByUuid);

async function getNewsPersonalized(req, res) {

    if (isUserLogged(req.session.user)) {

        res.send("NEWS CUSTOM COMING SOON")
        

    } else {
        
        getMostSearchedTickerRedis().then(response => {
            console.log(response)

            let promisesList = []

            let newsList = []

            response.forEach(element => {

                let news_ticker = getNewsByTicker(element, 2);
                promisesList.push(news_ticker);
            });

            Promise.all(promisesList).then(news => {
                newsList.push(news)
                res.send(newsList)
            })


        })

    }

}

function isUserLogged(user) {

    var logged = user == undefined ? false : true;
    return logged;
}

async function getMostSearchedTickerRedis() {
    return Promise.resolve(["TSLA", "AAPL", "RACE", "BYND", "PLTR"])
}

async function getNewsByTickerRequestHandler(req, res) {

    const ticker = req.params.ticker;
    const number = req.query.number ?? 5;

    getNewsByTicker(ticker, number).then(news => {
        return res.send(news)
    }).catch(err => res.status(500).send(err))

}

async function getNewsByTicker(ticker, number) {

    return new Promise((resolve, reject) => {

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

            console.log(results)

            resolve(results);

        }).catch(function (error) {
            reject(error);
        });

    })

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