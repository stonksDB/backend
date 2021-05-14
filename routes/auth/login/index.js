const login = require('express').Router();

const register = require('express').Router();

// hash password - increase system security
const crypto = require('crypto');
// body validation - json schema validation
const Ajv = require('ajv')
const ajv = new Ajv({removeAdditional:'all' })
const loginSchema = require('./login_schema.json');
ajv.addSchema(loginSchema, 'loggin-user')
// db interaction 
// const { models } = require('../../../sequelize');
const sequelize = require('../../../sequelize');
const { stringify } = require('querystring');

/**
 * Checks if user already logged -> req.session.email != null or undefined
 */
register.use(function(req, res, next) {
  const { email } = req.body;
  if(req.session.user)
    return res.status(400).send(`You are already logged!. \nYour current email is ${email}`);
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
 * Builds the query for the email searching
 * @param {String} key 
 * @returns {Object} - query object
 */
let withCredentials = (providedEmail, hashedPassword) => {
  return {
    where: {
        email: providedEmail,
        password: hashedPassword
    }
  }
}

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
 * Checks if there is already an account associated with the user email
 * @returns - error 401 if email already in use
 */
let validateUserCredentials = () => {
    return(req, res, next) => {
        const { email, password } = req.body;
        console.log("validating the credentials");
        return sequelize.models.share_holder.findOne(withCredentials(email, getHashedPassword(password))).then(result => {
            console.log("parsing result");
            if(!result) 
                return res.status(401).send(`Email: ${email}\nPassword: ${password}\nNo user matching`);
            next();
        });
    };
};

/**
 * Add the user 
 * @returns 200 - session associate to the user has been updated
 */
let addUserMailToCookie = () => {
    return (req, res) => {
      const { email } = req.body;
      // add user info to the session 
      req.session.user = {}
      req.session.user.email = email;
  
      return res.status(200).send("Updated user session!\n" + stringify(req.session) + "\nEmail: " + req.session.user.email);
    }
  }

/**
 * login end point - invoked only if the user not already logged in
 */
login.get("/", validateSchema('loggin-user'), validateUserCredentials(), addUserMailToCookie());

module.exports = login;
