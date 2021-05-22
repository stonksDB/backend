const login = require('express').Router();

const validateSchema = require('../../../validation') // schema validation

const sequelize = require('../../../sequelize'); // db interaction 

// utility functions
const { hash } = require('../auth_util'); 
const { withCredentials, withShareHolderId, getListOfSectors, getListOfTickers } = require('./login_util')

/**
 * Checks if user already logged -> req.session.email != null or undefined
 */
login.use(function(req, res, next) {
  const { email } = req.body;
  if(req.session.user)
    return res.status(401).send(`You are already logged!. \nYour current email is ${email}`);
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

let loadAdditionalUserInfo = () => {
  return async (req, res, next) => {
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
          return empty_json_object;
        return result;
      })

    const liked_tickers = getListOfTickers(like_tuples);
    const followed_sectors = getListOfSectors(follow_tuples);

    const merged_info = {}
    merged_info.share_holder_info = req.share_holder;
    merged_info.follows = followed_sectors;
    merged_info.likes = liked_tickers;

    res.status(200).send(JSON.stringify(merged_info));
  
    next(); // update cookie info
  }
}

/**
 * Add the user 
 * @returns 200 - session associate to the user has been updated
 */
let regenerateCookie = () => {
  return (req, res) => {
    let user_data = {}
    if(req.session.user_data !== undefined) // if already data in the prev. cookie, reassign them to new one
      user_data = req.session.user_data;

    const { email } = req.body;

    return req.session.regenerate(err => {
      req.session.user = user_data;
      req.session.user.email = email;
    })
  }
}

/**
 * login end point - invoked only if the user not already logged in
 */
login.get("/", validateSchema('login-user'), validateUserCredentials(), loadAdditionalUserInfo(), regenerateCookie());

module.exports = login;