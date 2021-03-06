// this file contains the definition for the request validation.
// it analyzes the path for an incoming request and it applies the correspondent json schema 

// body validation - json schema validation
const Ajv = require('ajv')
const ajv = new Ajv({removeAdditional:'all' })

// declared schemas
const loginSchema = require('./schemas/login_schema.json');
const registrationSchema = require('./schemas/registration_schema.json');

ajv.addSchema(loginSchema, 'login-user')
ajv.addSchema(registrationSchema, 'registration-user')

/**
 * prettify the errors generated during input validation
 * @param {Object[]} errors - list of errors generated during input validation
 * @returns 
 */
let prettifyErrors = (errors) => {
  let output = "";
  errors.forEach(error => {
    const { instancePath, message } = error; // extract data to generate the custome message
    const errorField = instancePath.replace("/", ""); // remove initial '/' from error location
    output = output.concat(`\n${errorField}: ${message}`);
  })
  
  return output;
}


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
        return res.status(400).send(prettifyErrors(ajv.errors));
      }
      next();
    }
}
  

module.exports = validateSchema;