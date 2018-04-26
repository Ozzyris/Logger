var Users = require('../models/users').Users,
    moment = require('moment'),
    http = require('../helpers/http');

function check_auth(req, res, next) {
  let auth_token = req.headers['x-auth-token']

	if(!xAuth){
		res.status(401).send([{message: "Your authentification token is invalid"}, code: 'auth_invalid'])
		return;
    }

	User.find_auth_token_detail_with_token()
		.then(token_details => {
			return token_manager.check_session_token( token_details );
		})
		.then(is_token_valid => {
			return next();
		})
		.catch(error => {
			console.log( error );
		})

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (req.user.authenticated)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.redirect('/');
}

module.exports={
    'check_auth': check_auth
}