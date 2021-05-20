/**
 * Builds the query for user searching
 * @param {String} email
 * @param {String} hashedPassword 
 * @returns {Object} - query object
 */
 exports.withCredentials = (providedEmail, hashedPassword) => {
    return {
      where: {
          email: providedEmail,
          password: hashedPassword
      }
    }
}