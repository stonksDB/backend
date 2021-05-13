const auth = require('express').Router();
// parse cookies - personalize response
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// hash password - increase system security
const crypto = require('crypto');
// body validation - json schema validation
const Ajv = require('ajv')
const ajv = new Ajv({removeAdditional:'all' })
const registrationSchema = require('./json_schema.json');
const { doesNotMatch } = require('assert');
ajv.addSchema(registrationSchema, 'new-user')
// db interaction 
// const { models } = require('../../../sequelize');
const sequelize = require('../../../sequelize');
const { Op, json } = require('sequelize');
const { stringify } = require('querystring');


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
    return sequelize.models.share_holder.findOne(withEmail(email)).then(result => {
      if(result)
        res.status(400).send(`Email ${email} is already in use`);
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
 * 
 * @param {String} body body request from the user 
 * @param {Integer} nextIndex next index for the nex user
 * @returns 
 */
 let withData = (body, nextIndex) => {
  const { firstName, lastName, dob, country, email, password } = body;
  const dict = {
    share_holder_id: nextIndex,
    first_name: firstName,
    last_name: lastName,
    dob: dob,
    country: country, 
    email: email,
    password: getHashedPassword(password)
  };
  
  dict.additionalField = 0;
  return dict;
 }



/**
 * Checks if the is already an account associated with the email address
 * @returns {Object} response
 */
 let registerNewUser = () => {
  return (req, res) => {
    return sequelize.models.share_holder.findOne({
      order: [['share_holder_id', 'DESC']],
      attributes: ['share_holder_id']
    }).then(last_inserted_share_holder => {
      // save data of the new user
      return sequelize.transaction(function (t) {
        return sequelize.models.share_holder.create(withData(req.body, last_inserted_share_holder.share_holder_id + 1), {transaction: t})
      }).then(function (result) {
        // Transaction has been committed
        return res.status(200).send("Successfully added new user\n" + stringify(result));
      }).catch(function (err) {
        // Transaction has been rolled back
        return res.status(400).send("Fail to insert the new user\n" + stringify(err))
      });
    });
  };
 };

auth.post("/", validateSchema("new-user"), checkEmailPasswordMatches(), checkEmailAvailable(), registerNewUser());

module.exports = auth;