const login = require('express').Router();

const validateSchema = require('../../../validation') // schema validation

const sequelize = require('../../../sequelize'); // db interaction 

// utility functions
const { hash } = require('../auth_util'); 
const { withCredentials } = require('./login_util')

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
        return sequelize.models.share_holder.findOne(withCredentials(email, hash(password))).then(result => {
            if(!result) 
                return res.status(401).send(`Email or Password wrong!`);
            next();
        });
    };
};

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
      return res.status(200).send(`Successfully logged in! Your current email address: ${email}`);
    })
  }
}

/**
 * login end point - invoked only if the user not already logged in
 */
login.get("/", validateSchema('login-user'), validateUserCredentials(), regenerateCookie());

module.exports = login;