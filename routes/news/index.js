const news = require('express').Router();
const sequelize = require('../../sequelize');

const axios = require('axios');

const { getMostSearchedTickers } = require('../utils/redis/global_redis_utils')
const { getUserAnalytics } = require('../utils/redis/user_redis_utils');
const { requestOptTicker, requestOptUuid, getRandomKey } = require('./news_api_util')

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
    // promise prototype
    return new Promise((resolve, reject) => {

        const promisedNews = []

        const news_per_ticker = parseInt(10 / list_ticker.length)

        list_ticker.forEach(ticker => {
            const news_ticker = getNewsByTicker(ticker, news_per_ticker);
            promisedNews.push(news_ticker);
        });

        Promise.all(promisedNews).then(news => {
            // extract subarrays - create single array of elements
            news = Array.prototype.concat.apply([], news);
            resolve(news)
        }).catch(_ => { 
            reject(news) 
        });
    });
}

/**
 * 
 * @param {String} ticker - ticker to which news are related
 * @param {Integer} number - number of news to be retrieved
 * @returns {[Promise]} - array of promised news about the ticker 
 */
async function getNewsByTicker(ticker, number) {

    return new Promise((resolve, reject) => {

        axios.request(requestOptTicker(ticker, number)).then(function (apiResponse) {

            const retrievedNews = []

            apiResponse.data.data.main.stream.forEach(newsInfo => {
                const newsObj = {
                    "ticker": ticker,
                    "uuid": newsInfo.id,
                    "title": newsInfo.content.title,
                    "img": newsInfo.content.thumbnail.resolutions[0] ?? "",
                    "published_at": newsInfo.content.pubDate,
                    "provider": newsInfo.content.provider.displayName
                }

                retrievedNews.push(newsObj)
            });

            resolve(retrievedNews);

        }).catch(function (error) {
            reject(error);
            // propagate error up - so to inform parent
            throw error
        });
    });
};

async function getNewsByTickerRequestHandler(req, res) {

    const ticker = req.params.ticker;
    const number = req.query.number ?? 5;

    getNewsByTicker(ticker, number).then(news => {
        return res.send(news)
    }).catch(err => res.status(500).send(err))

}

const getSingleNewsByUuid = () => { 
    return (req, res) => {

    // unique identifier for the news
    const uuid = req.params.uuid;

    axios.request(requestOptUuid(uuid)).then(function (apiResponse) {
        return res.status(200).json(apiResponse.data)
        }).catch(function (error) {
            res.send(error)
        });
    };
}

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
news.get("/single/:uuid", getSingleNewsByUuid());



module.exports = news;