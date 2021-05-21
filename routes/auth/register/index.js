const register = require('express').Router();

const validateSchema = require('../../../validation') // schema validation

const sequelize = require('../../../sequelize'); // db interaction 

// utility functions
const { hash } = require('../auth_util'); 
const { next_id_available, checkEmailPasswordMatches, checkEmailAvailable } = require('./registration_util')

// dictionary - contains the list of valid sector names and their correspondent id
const convertion_table = {
  "Healthcare": 0,
  "Industrials": 1,
  "Consumer Cyclical": 2,
  "Financial Services": 3,
  "Technology": 4,
  "Energy": 5,
  "Real Estate": 6,
  "Basic Materials": 7,
  "Communication Services": 8,
  "Consumer Defensive": 9,
  "Utilities": 10,
  "Industrial Goods": 11,
  "Services": 12,
  "Financial": 13, 
  "Consumer Goods":14
}

/**
 * Checks if user already logged -> req.session.email != null or undefined
 */
register.use(function(req, res, next) {
  const { email } = req.body;
  if(req.session.user)
    return res.status(401).send(`Log out before to register a new account. \nYour current email is ${email}`);
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

  const toBeInserted = {}
  follows.forEach(str => {
    if(convertion_table[str] !== undefined) { // insert only valid sector names
      toBeInserted[str] = convertion_table[str];
    } 
  })
  
  const follow_tuples = []
  // create list of follow instances
  Object.keys(toBeInserted).forEach((sector_entry)=> follow_tuples.push(
    {
      share_holder_id: share_holder_id,
      sector_id: toBeInserted[sector_entry]
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
 let share_holder_data = (body, nextIndex) => {
   const { firstName, lastName, dob, country, email, password } = body;
   const hashedPassword = hash(password)
   
   const dict = {
    share_holder_id: nextIndex,
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
  return (req, res, next) =>  {
    try {
      sequelize.transaction(async (t) => {

        const next_share_holder_id = await next_id_available();

        await sequelize.models.share_holder.create(
          share_holder_data(req.body, next_share_holder_id),
          {transaction: t}
        );
        
        const follow_data = follow_tuples_array(req.body,next_share_holder_id)

        await sequelize.models.follow.bulkCreate(
          follow_data,
          {transaction: t}
        );
      })
      next();
    }
    catch {
      res.status(500).send('Error on database update!')
    }
  }
}

/**
 * Update current user session - add its email address in the user object
 * @returns 200 OK - successfully updated the user session
 */
let addUserMailToCookie = () => {
  return (req, res) => {
    const { email } = req.body;
    
    // add user info to the session 
    req.session.user = {}
    req.session.user.email = email;

    return res
      .status(200)
      .send(`Updated user session!\nYour current email: ${req.session.user.email}`);
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
  , addUserMailToCookie());

module.exports = register;