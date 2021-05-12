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
const { Op } = require('sequelize');


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
  const query = {
    where: {
        email: key
    }
  }
  return query;
}

/**
 * Checks the input email address is already associated to an account
 * @param {String} email - to be checked
 * @return {Boolean} - true if account not already associated
 */
function emailAvailable(email){
  let isValid = true;
  try {
      sequelize.models.share_holder.findOne(withEmail(email)).then(result => {
        if(!(result === undefined || result === null)) {
          console.log("No account associated");
          isValid = false;
        }
    });
  } catch (error) {
      console.log("Error at registration phase\n", error)
  }
  return isValid;
};

/**
 * Checks if the is already an account associated with the email address
 * @returns {Object} response
 */
 let checkEmailAvailable = () => {
  return (req, res, next) => {
    const { email } = req.body;
    if(!emailAvailable(email)) {
      return res.status(400).send("Email already in use!");
    }
  next()
  }
}

/**
 * Checks if the is already an account associated with the email address
 * @returns {Object} response
 */
 let registerNewUser = () => {
  return (req, res) => {
    insertNewUser(req, res);
  }
 }

 let bodyToDict = (body) => {
  const dict = {};
  for (let [key, value] of Object.entries(body)) {
      dict[key] = value;
  }
  dict.additionalField = 0;
  return dict;
 }

async function insertNewUser(req, res) {
  sequelize.transaction();
  //const { firstName, lastName, dob, country, email, password} = req.body;
  /*const t = await sequelize.connection.transaction();
  return sequelize.transaction(() => {
    return share_holder.create(bodyToDict(req.body), {transaction: t})
  }).then(result => {
        res.status(200).send("user added successfully");
    }).catch(error => {
        console.log(error);
        t.rollback();
        res.status(500).send("user not added");
    });
  */
};
 
/**
 * Returns the hash value of the input password
 * @param {String} password - password to be hashed
 * @returns {String} hash value
 */

 const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}


auth.post("/", validateSchema("new-user"), checkEmailPasswordMatches(), checkEmailAvailable(), registerNewUser());


module.exports = auth;