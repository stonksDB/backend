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
        return sequelize
          // exploit transaction - if error rollback
          .transaction(function (t) {
            return sequelize.models.share_holder
              // create new user instance 
              .create(withData(req.body, last_inserted_share_holder.share_holder_id + 1), {transaction: t});
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