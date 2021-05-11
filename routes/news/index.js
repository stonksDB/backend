const news = require('express').Router();
const { models } = require('../../sequelize');
const { Op } = require('sequelize');

news.get("/:news_id", getNewsByid);
news.get("/", getAllNews);

async function getNewsByid(req, res) {

    const news_id = req.params.news_id;

    try {

        const news = await models.news.findOne({ where: { news_id: news_id } });

        if (news === null) {
            res.status(404).json("Not found")
        } else {
            res.status(200).json(news);
        }

    } catch (error) {
        console.log("there was an error", error)
    }

};

async function getAllNews(req, res) {

    const offset = req.query.offset ?? 0
    const limit = req.query.limit ?? 5
    const key = req.query.key ?? ""

    const withParameters = buildQueryAllByTimestamp(offset, limit, key);

    try {

        const { count, rows } = await models.news.findAndCountAll(withParameters);

        const result = {
            data: {
                news: rows
            },
            pageable: {
                total: count,
                offset: limit
            }
        }

        res.status(200).json(result);
    } catch (error) {
        console.log("there was an error", error)
    }

};

function buildQueryAllByTimestamp(offset, limit, key) {

    const query = {
        order: [['publish_date', 'ASC']],
        where: {
            [Op.and]: [
                { title: { [Op.substring]: key } }
            ]
        },
        attributes: ['news_id', 'publish_date', 'title', 'author', 'link'],
        offset: offset,
        limit: limit
    }

    return query;
}

module.exports = news;