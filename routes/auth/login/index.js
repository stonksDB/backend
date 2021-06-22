const login = require('express').Router();

const validateSchema = require('../../../validation') // schema validation

const sequelize = require('../../../sequelize'); // db interaction 

// utility functions
const { hash } = require('../auth_util'); 
const { withCredentials, withShareHolderId, getListOfSectors, getListOfTickers, removePassword } = require('./login_util')

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
      return sequelize.models.share_holder.findOne(withCredentials(email, hash(password))).then(shareHolderRaw => {
        if(!shareHolderRaw) 
          return res.status(401).send(`Email or Password wrong!`);
            
        // attach share_holder returned to req object - eval the raw description
        req.locals = {};
        req.locals.share_holder = removePassword(shareHolderRaw);
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
      req.session.user.share_holder_id = req.locals.share_holder.share_holder_id;
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
    const emptyJsonObject = JSON.parse("{}")

    const followTuples = await sequelize.models.follow.findAll(withShareHolderId(req.locals.share_holder.share_holder_id))
      .then(result => {
        if(!result)
          return emptyJsonObject; // empty Json Object
        return result;
      });

    const likeTuples = await sequelize.models.like.findAll(withShareHolderId(req.locals.share_holder.share_holder_id))
      .then(result => {
        if(!result)
          return emptyJsonObject; // empty Json Object
        return result;
      })

    const followedSectors = getListOfSectors(followTuples);
    const likedTickers = getListOfTickers(likeTuples);

    const mergedInfo = {}
    mergedInfo.share_holder_info = req.locals.share_holder;
    mergedInfo.follows = followedSectors;
    mergedInfo.likes = likedTickers;

    return res.status(200).send(JSON.stringify(mergedInfo));
  }
}

/**
 * login end point
 */
login.post("/", validateSchema('login-user'), validateUserCredentials(), regenerateCookie(), returnAdditionalUserInfo());

module.exports = login;