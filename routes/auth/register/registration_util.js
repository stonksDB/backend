const sequelize = require('./../../../sequelize'); // db interaction 

/**
* Builds the query for the email retrieval
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
* Retrieves the last inserted user's id and increments it. Returns 0 if no user currently registered
* @returns {Integer} next share_holder_id available
*/
exports.next_id_available = async function next_id_available() {
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
 * Checks if the email and the password matches with their confirmation values
 * @returns {Object} response
 */
exports.checkEmailPasswordMatches = () => {
    return (req, res, next) => {
      const { email, confirmationEmail, password, confirmationPassword } = req.body;
      let matches = (email === confirmationEmail) & (password === confirmationPassword);
      if(!matches) {
        return res.status(401).send("Either email or password doesn't matches");
      }
    next()
    }
}

/**
 * Checks if the is already an account associated with the email address
 * @returns {Object} response
 */
exports.checkEmailAvailable = () => {
    return (req, res, next) => {
      const { email } = req.body;
      return sequelize.models.share_holder
        .findOne(withEmail(email))
        .then(result => {
          if(result)
            return res.status(401).send(`Email ${email} is already in use`);
          next();
        }
    )};
};

/**
 * Builds the query for follow tuples searching
 * @param {Integer} share_holder_id
 * @returns {Object} - query object
 */
 exports.getListOfSectors = (tuples) => {
  const list = [];
  tuples.forEach(tuple => list.push(tuple.sector_id));

  return list;
}