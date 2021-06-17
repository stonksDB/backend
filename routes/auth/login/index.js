const login = require('express').Router();

const validateSchema = require('../../../validation') // schema validation

const sequelize = require('../../../sequelize'); // db interaction 

// utility functions
const { hash } = require('../auth_util'); 
const { withCredentials, withShareHolderId, getListOfSectors, getListOfTickers } = require('./login_util')

/**
 * Checks if user already logged -> req.session.user != null or undefined
 */
login.use((req, res, next) => {
  if(req.session.user) {
    return res.status(401).send(`You are already logged!.`);
  }
  next();
});

/**
 * Checks if there is already an account associated with the user email
 * @returns - error 401 email or password wrong
 */
let validateUserCredentials = () => {
    return(req, res, next) => {
        const { email, password } = req.body;
        return sequelize.models.share_holder.findOne(withCredentials(email, hash(password))).then(share_holder => {
            if(!share_holder) 
                return res.status(401).send(`Email or Password wrong!`);
            // attach share_holder returned to req object!
            req.share_holder = share_holder;
            next();
        });
    };
};

/**
 * Renegerate session id and cookie associated; add to the session the user info
 * @returns 200 - session associate to the user has been updated
 */
let regenerateCookie = () => {

  return (req, _, next) => {
    const { email } = req.body;
    req.session.regenerate((err) => {
      req.session.user = {};
      req.session.user.email = email;
    });
    next();
  }
}

/**
 * 
 * @returns 200 - returned as Json user related information: liked tickers, followed sectors and general data
 */
 let returnAdditionalUserInfo = () => {
  return async (req, res) => {
    const empty_json_object = JSON.parse("{}")

    const follow_tuples = await sequelize.models.follow.findAll(withShareHolderId(req.share_holder.share_holder_id))
      .then(result => {
        if(!result)
          return empty_json_object; // empty Json Object
        return result;
      });

    const like_tuples = await sequelize.models.like.findAll(withShareHolderId(req.share_holder.share_holder_id))
      .then(result => {
        if(!result)
          return empty_json_object; // empty Json Object
        return result;
      })

    const liked_tickers = getListOfTickers(like_tuples);
    const followed_sectors = getListOfSectors(follow_tuples);

    const merged_info = {}
    merged_info.share_holder_info = req.share_holder;
    merged_info.follows = followed_sectors;
    merged_info.likes = liked_tickers;

    return res.status(200).send(JSON.stringify(merged_info));
  }
}

/**
 * login end point
 */
login.post("/", validateSchema('login-user'), validateUserCredentials(), regenerateCookie(), returnAdditionalUserInfo());

module.exports = login;