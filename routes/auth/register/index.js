const register = require('express').Router();

// password hashing
const crypto = require('crypto');

// body validation - json schema validation
const Ajv = require('ajv')
const ajv = new Ajv({removeAdditional:'all' })
const registrationSchema = require('./registration_schema.json');
ajv.addSchema(registrationSchema, 'new-user')

// db interaction
const sequelize = require('../../../sequelize');
const { stringify } = require('querystring');

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
    return res.status(400).send(`Log out before to register a new account. \nYour current email is ${email}`);
  next();
});

/**
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 * @return {Object} response
 */
 let validateSchema = (schemaName) => {
  return (req, res, next) => {
    let valid = ajv.validate(schemaName, req.body)
    if (!valid) {
      return res.status(400).send(ajv.errors);
    }
    next()
  }
}

/**
 * Checks if the email and the password matches with their confirmation values
 * @returns {Object} response
 */
let checkEmailPasswordMatches = () => {
  return (req, res, next) => {
    const { email, confirmationEmail, password, confirmationPassword } = req.body;
    let matches = (email === confirmationEmail) & (password === confirmationPassword);
    if(!matches) {
      return res.status(400).send("Either email or password doesn't matches");
    }
  next()
  }
}

/**
 * Returns the query object for email retrieval
 * @param {String} key 
 * @returns {Object} - query object
 */
let withEmail = (key) => {
  return {
    where: {
        email: key
    }
  }
}

/**
 * Checks if the is already an account associated with the email address
 * @returns {Object} response
 */
 let checkEmailAvailable = () => {
  return (req, res, next) => {
    const { email } = req.body;
    return sequelize.models.share_holder
      .findOne(withEmail(email))
      .then(result => {
        if(result)
          return res.status(400).send(`Email ${email} is already in use`);
        next();
        }
      )};
  };

/**
 * Returns the hash value of the input password
 * @param {String} password - password to be hashed
 * @returns {String} hash value
 */

 const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  return sha256.update(password).digest('base64');
}

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
   const hashedPassword = getHashedPassword(password)
   
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
 * Retrieves the last inserted user's id and increments it. Returns 0 if no user currently registered
 * @returns {Integer} next share_holder_id available
 */
async function next_id_available() {
  const last_user = await sequelize.models.share_holder.findOne(
    {
    order: [['share_holder_id', 'DESC']],
    attributes: ['share_holder_id']
    }
  );
   
  if(last_user)
    return last_user.share_holder_id + 1;
  else 
    return 0;
}

/**
 * Save into database the new user data
 * @param {String} body 
 * @returns 
 */
async function insertUserData(body) {
  try {

    return await sequelize.transaction(async (t) => {

      const next_share_holder_id = await next_id_available();

      const insert_user_data = await sequelize.models.share_holder.create(
        share_holder_data(body, next_share_holder_id),
        {transaction: t}
      );
      
      const follow_data = follow_tuples_array(body,next_share_holder_id)

      const insert_followed_sectors = await sequelize.models.follow.bulkCreate(
        follow_data,
        {transaction: t}
      );

      return {
        ...insert_user_data,
        insert_followed_sectors
      };
    });
  } catch (error) {
    // error occurred - transaction already rolled back
  }
} 

/**
 * Add new user 
 * @returns 400 - Internal Server Error during the db update
 */
 let registerNewUser = () => {
  return (req, res, next) =>  {

    const function_exec = insertUserData(req.body);
    console.log('return from function exec' + stringify(function_exec))
    next()
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
  , validateSchema("new-user")
  , checkEmailPasswordMatches()
  , checkEmailAvailable()
  , registerNewUser()
  , addUserMailToCookie());

module.exports = register;