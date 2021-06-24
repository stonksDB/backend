const news = require('express').Router();
const sequelize = require('../../sequelize');

const axios = require('axios');
const { resolve } = require('path');

const { getMostSearchedTickers } = require('../utils/redis/global_redis_utils')
const { getUserAnalytics } = require('../utils/redis/user_redis_utils');
const { nextTick } = require('process');

let userLogged = (user) => {
    return (user == undefined || user == null) ? false : true;
}
/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
 let returnNews = () => {
    return (req, res) => { 
        getNewsByTickerList(req.locals.tickers_of_interest_for_user).then(news => { res.status(200).json(news); })
            .catch(err => { res.status(500).json(err) })    
    }
}

/**
 * Returns a set of news. Personalization applied
 * 
 * The news personalization happens in three different phases:
 *  1) get user liked tickers - give priority to them since of interest for the user
 *  2) get user most searched stocks - may be of interest since user has searched them 
 *  3) get news based on general search counters - simulate preferencies based on other user preferencies
 * 
 * @param {Reqeust} req 
 * @param {Response} res 
 */
let personalizeResponse = () => {
    return async (req, res, next) => {
        // USER DEPENDENT PERSONALIZATION
        const tickers_of_interest_for_user = new Set()

        if (userLogged(req.session.user)) {        
            const email = req.session.user.email;
            const share_holder_id = req.session.user.share_holder_id;

            // 1) user liked tickers
            const likes_tuples = await sequelize.models.like.findAll({
                where: {
                    share_holder_id: share_holder_id
                },
                attributes: ["ticker"]
            });

            likes_tuples
                .map(tuple => tuple.get("ticker")) // extract value from Sequelize Result
                // Could have been used a forEach maybe (?)
                .reduce((tickerSet, newTicker) => tickerSet.add(newTicker), tickers_of_interest_for_user); // adds each ticker to the ticker_of_interest set
                
            
            // 2) search for redis
            const tickers_search_by_user = await getUserAnalytics(email);
            tickers_search_by_user.reduce((tickerSet, newTicker) => tickerSet.add(newTicker), tickers_of_interest_for_user);
            
            console.log(tickers_of_interest_for_user)
        }

        // USER INDEPENDENT PERSONALIZATION - IF USER NOT LOGGED OR NO CUSTOM INFORMATION AVAILABLE

        // if user hasn't any kind of information, neither from Liked Tickers nor from Redis
        if (tickers_of_interest_for_user.size == 0) {

            // add tickers based on general preferences
            const array_from_redis = await getMostSearchedTickers();
            array_from_redis.reduce((tickerSet, newTicker) => tickerSet.add(newTicker), tickers_of_interest_for_user);

        }
        // store in req object the user personalization
        req.locals = {}
        req.locals.tickers_of_interest_for_user = Array.from(tickers_of_interest_for_user)    
        next();
    }
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

/**
 * returns personalized news based on user preferred tickers
 */
news.get('/', personalizeResponse(), returnNews())

/**
 * returns news involving a given ticker
 */
news.get("/:ticker", getNewsByTickerRequestHandler);

/**
 * returns a precise news (?) identified by the uuid code
 */
news.get("/single/:uuid", getSingleNewsByUuid);

module.exports = news;