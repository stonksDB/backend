const logout = require('express').Router();

/**
 * Checks if user not logged -> if not, no sense to logout -> error returned
 */
 logout.use(function(req, res, next) {
    if(!req.session.user)
      return res.status(401).send(`You must login before to logout!`);
    next();
  });

/**
 * logout end point - invoked only if the user is logged in
 */
logout.get("/", (req, res) => {
    // regenerate the session without user information attached
    return req.session.regenerate(err => {
      return res.status(200).send(`Successfully logged out!`);
    });
  });

module.exports = logout;
