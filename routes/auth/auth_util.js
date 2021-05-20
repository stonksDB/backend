const crypto = require('crypto');

/**
 * Returns the hash value of the input password
 * @param {String} password - password to be hashed
 * @returns {String} hash value
 */
exports.hash = (password) => {
    const sha256 = crypto.createHash('sha256');
    return sha256.update(password).digest('base64');
}
