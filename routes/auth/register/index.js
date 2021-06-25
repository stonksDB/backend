const register = require('express').Router();

const validateSchema = require('../../../validation') // schema validation

const sequelize = require('../../../sequelize'); // db interaction 

// utility functions
const { hash } = require('../auth_util');
const { checkEmailPasswordMatches, checkEmailAvailable, getListOfSectors, getKeys } = require('./registration_util')

/**
 * Checks if user already logged -> req.session.email != null or undefined
 */
register.use(function (req, res, next) {
  if (req.session.user)
    return res.status(401).send(`Log out before to register a new account. \nYour current email is ${req.session.user.email}`);
  next();
});

/**
 * Returns the array of Follow instances to be inserted
 * @param {String} body 
 * @param {Integer} share_holder_id 
 * @returns - array of Follow instances
 */
let follow_tuples_array = (body, share_holder_id) => {
  const { follows } = body

  const filtered = follows.filter((val) => val >= 0 & val <= 14)

  let id_set = new Set(filtered); // remove duplicates

  // create list of follow instances
  const follow_tuples = []
  id_set.forEach((sector_id) => follow_tuples.push(
    {
      share_holder_id: share_holder_id,
      sector_id: sector_id
    }
  ));

  return follow_tuples;
}

/**
 * 
 * @param {String} body body request from the user 
 * @param {Integer} nextIndex next index for the nex user
 * @returns 
 */
let share_holder_data = (body) => {
  const { firstName, lastName, dob, country, email, password } = body;
  const hashedPassword = hash(password)

  const dict = {
    first_name: firstName,
    last_name: lastName,
    dob: dob,
    country: country,
    email: email,
    password: hashedPassword
  };

  dict.additionalField = 0;
  return dict;
}



/**
 * Add new user 
 * @returns 400 - Internal Server Error during the db update
 */
let registerNewUser = () => {
  return (req, res, next) => {
    
    sequelize.transaction(async (t) => {

      req.locals = {};

      // attach data to req obj - will be available for subsequent middlewares
      req.locals.share_holder_obj = share_holder_data(req.body);      
      
      const newShareHolder = await sequelize.models.share_holder.create(
        req.locals.share_holder_obj,
        { transaction: t }
      );

      // add to locals the share_holder_id
      req.locals.share_holder_obj.share_holder_id = newShareHolder.dataValues.share_holder_id;

      //add new id just created
      req.locals.follow_data = follow_tuples_array(req.body, newShareHolder.dataValues.share_holder_id);

      await sequelize.models.follow.bulkCreate(
        req.locals.follow_data,
        {transaction: t}
      );
    }).
      then(_ => { next(); }) // invoked if no error while updating the db
      .catch(err => { console.log(err); return res.status(500).send('Error on database update!') }); // if error on updating db
  }
}

/**
 * Update current user session - add its email address in the user object
 * @returns 200 OK - successfully updated the user session
 */
let regenerateCookie = () => {
  return (req, _, next) => {
    const { email } = req.body;

    // add user info to the session 
    req.session.user = {}
    req.session.user.email = email;
    req.session.user.share_holder_id = req.locals.share_holder_obj.share_holder_id;

    next();
  }
}

/**
 * returns an object containing a summary of the share_holder created
 * @returns 
 */
let returnUserInfo = () => {
  return (req, res) => {
    const userInfo = {}
    userInfo.share_holder_info = req.locals.share_holder_obj;
    // remove sensible information
    delete userInfo.share_holder_info.password;
    delete userInfo.share_holder_info.additionalField;

    userInfo.follows = getListOfSectors(req.locals.follow_data); // from tuples [<id>:<sector>] extract [<sector>] - sectors filtered since are those inserted in the db
    userInfo.likes = []; // empty since no likes by default provided

    res.status(200).send(JSON.stringify(userInfo));
  }
}

/**
 * registration end point
 */
register.post("/"
  , validateSchema("registration-user")
  , checkEmailPasswordMatches()
  , checkEmailAvailable()
  , registerNewUser()
  , regenerateCookie()
  , returnUserInfo());

module.exports = register;