const logout = require('express').Router();


/**
 * Checks if user not logged -> if not, no sense to logout -> error returned
 */
 logout.use(function(req, res, next) {
    if(!req.session.user)
      return res.status(400).send(`You must login before to  logout!`);

    // user logged
    next();
  });

/**
 * logout end point - invoked only if the user is logged in
 */
logout.get("/", (req, res) => {
    if(!req.session.user)
      return res.status(400).send(`You must login before to  logout!`);
    req.session.destroy();
    return res.status(200).send(`Successfully logged out!`);
  });

module.exports = logout;
