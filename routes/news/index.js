const news = require('express').Router();
const { models } = require('../../sequelize');

const axios = require('axios');
const { resolve } = require('path');

const { getMostSearchedTickers } = require('../redis/global_redis_utils')
const { getUserAnalytics } = require('../redis/user_redis_utils')



news.get('/', getNewsPersonalized)
news.get("/:ticker", getNewsByTickerRequestHandler);
news.get("/single/:uuid", getSingleNewsByUuid);

async function getNewsPersonalized(req, res) {

    const ticker_set = new Set()

    if (isUserLogged(req.session.user)) {        

        const email = req.session.user.email;
        const share_holder_id = req.session.user.share_holder_id;

        //1) search for follows
        const rows = await models.like.findAll({
            where: {
                share_holder_id: share_holder_id
            },
            attributes: ["ticker"]
        })

        rows.map(t => t.get("ticker")).reduce((s, e) => s.add(e), ticker_set);

        console.log("redis")

        //2) search for redis
        let array_from_redis = await getUserAnalytics(email);        
        array_from_redis.reduce((s, e) => s.add(e), ticker_set);

    }

    //3) fallback to getUserLoggedOut
    if (ticker_set.size == 0) {

        let array_from_redis = await getMostSearchedTickers();
        array_from_redis.reduce((s, e) => s.add(e), ticker_set);

    }

    let array_news = Array.from(ticker_set)    
    getNewsByTickerList(array_news).then(news => {

        res.send(news);

    }).catch(err => {
        console.log(err)
    })    
}

function isUserLogged(user) {

    var logged = user == undefined ? false : true;
    return logged;

}

async function getShareHolderId(mail) {
    const share_holder = await models.share_holder.findOne({
        where: {
            email: mail
        },
        attributes: ['share_holder_id']
    })

    return share_holder.share_holder_id
}

function getNewsByTickerList(list_ticker) {

    return new Promise((resolve) => {

        let promisesList = []

        let newsList = []

        let number_of_tickers = parseInt(10 / list_ticker.length)

        list_ticker.forEach(ticker => {

            let news_ticker = getNewsByTicker(ticker, number_of_tickers);
            promisesList.push(news_ticker);

        });

        Promise.all(promisesList).then(news => {
            news = Array.prototype.concat.apply([], news);
            resolve(news)
        })
    })

}

async function getNewsByTicker(ticker, number) {

    return new Promise((resolve, reject) => {

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

            resolve(results);

        }).catch(function (error) {
            reject(error);
        });

    })

};

async function getNewsByTickerRequestHandler(req, res) {

    const ticker = req.params.ticker;
    const number = req.query.number ?? 5;

    getNewsByTicker(ticker, number).then(news => {
        return res.send(news)
    }).catch(err => res.status(500).send(err))

}

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