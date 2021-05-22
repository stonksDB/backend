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

/**
 * Builds the query for follow tuples searching
 * @param {Integer} share_holder_id
 * @returns {Object} - query object
 */
 exports.withShareHolderId = (share_holder_id) => {
  return {
    where: {
        share_holder_id: share_holder_id
    }
  }
}

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

/**
 * Builds the query for follow tuples searching
 * @param {Integer} share_holder_id
 * @returns {Object} - query object
 */
 exports.getListOfTickers = (tuples) => {
  const list = [];
  tuples.forEach(tuple => list.push(tuple.ticker));

  return list;
}