const register = require('express').Router();

// hash password - increase system security
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
 * Builds the query for the email searching
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

let followed_sectors_data = (body) => {
  const { follows_arr } = body

  // 1) filters out all not-valid sectors
  // 2) valid sectors are stored in the toBeInserted array with their correspondent id
  const toBeInserted = []
  follows_arr.forEach(str => {
    if(convertion_table[str] !== undefined) // valid sector
      toBeInserted.push({
        str: convertion_table[str]
      }) 
  })
  console.log("output dictionary: " + stringify(toBeInserted));
  return toBeInserted;
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
 * Add new user 
 * @returns 400 - Internal Server Error during the db update
 */
 let registerNewUser = () => {
  return (req, res, next) => {
    return sequelize.models.share_holder
      // get the last inserted user
      .findOne({
        order: [['share_holder_id', 'DESC']],
        attributes: ['share_holder_id']
      }) 
      // add the new user
      .then(last_inserted_share_holder => {
        // update db with new user
        return sequelize.transaction(function (t) {
            const insert_user_data = sequelize.models.share_holder
              .create(share_holder_data(req.body, last_inserted_share_holder.share_holder_id + 1), {transaction: t});
            
            const insert_followed_sectors = followed_sectors_data(req.body).forEach(sector => {
              sequelize.models.sector
              .create(sector, {transaction: t});
            })
            
            return {
              ...insert_user_data,
              insert_followed_sectors
            }
          })
          .then(function (result) {
            // transaction commit
            next();
          })
          .catch(function (err) {
            // transaction rollback
            return res.status(400).send("Fail to insert the new user\n" + stringify(err))
        });
      });
    };
 };

 try {

  const result = await sequelize.transaction(async (t) => {

    const insert_user_data = await sequelize.models.share_holder.create(
      share_holder_data(req.body, last_inserted_share_holder.share_holder_id + 1),
      {transaction: t}
    );

    const insert_followed_sectors = await sequelize.models.sector.bulkCreate(
      followed_sectors_data,
      {transaction: t}
    );

    return {
      ...insert_user_data,
      insert_followed_sectors
    };
  });

} catch (error) {

  // If the execution reaches this line, an error occurred.
  // The transaction has already been rolled back automatically by Sequelize
  console.log("\n\nSomething went wrong ")
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