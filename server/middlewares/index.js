var Users = require('../models/users').Users;

//HELPERS
var token_manager = require('../helpers/token_manager');


function check_auth(req, res, next) {
  let auth_token = req.headers['x-auth-token']
  let session;

	if(!xAuth){
		res.status(401).send([{message: "Your authentification token is invalid"}, code: 'auth_invalid'])
		return;
    }

	Users.find_auth_token_detail_with_token( auth_token )
		.then(token_details => {
			return token_manager.check_if_token_is_valid( token_details );
			session.keep_session = token_details.keep_session;
		})
		.then(is_token_valid => {
			if(session.keep_session){
				session.expiration_date = moment().add(7,'day');
			}else{
				session.expiration_date = moment().add(1,'day');
			}
			return Users.update_token_timestamp( auth_token, session );
		})
		.then(is_token_updated => {
			return next();
		})
		.catch(error => {
			console.log( error );
		})
}

module.exports={
    'check_auth': check_auth
}