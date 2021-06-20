const user = require('express').Router();

const follow = require('./follow');
const like = require('./like');

/** 
 * protected area, user must be authorized - only logged user could access
*/  

user.use((req, res, next) => {
	if(req.session.user)  // means user is logged in
		next();
	else
    return res.sendStatus(401);
  }
);

user.use('/follow', follow);
user.use('/like', like);

module.exports = user;