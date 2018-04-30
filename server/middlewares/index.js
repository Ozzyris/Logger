var users = require('../models/users').users,
	moment = require('moment');

//HELPERS
var token_manager = require('../helpers/token_manager');


function check_auth(req, res, next) {
	let xtoken = req.headers['x-auth-token'],
		session;

	if(!xtoken){
		res.status(401).send([{message: "Your authentification token is invalid", code: 'auth_invalid'}])
		return;
	}

	users.get_auth_detail_from_xtoken( xtoken )
		.then(token_details => {
			session = token_details;
			return token_manager.check_if_token_is_valid( token_details );
		})
		.then(is_token_valid => {

			if(session.keep_session){
				session.expiration_date = moment().add(7,'day');
			}else{
				session.expiration_date = moment().add(1,'day');
			}
			return users.update_token_timestamp_from_xtoken( xtoken, session );
		})
		.then(is_token_updated => {
			return next();
		})
		.catch(error => {
			console.log( 'middleware_error : ', error );
		})
}

function check_admin_auth(req, res, next){
	let xtoken = req.headers['x-auth-token'],
		session;

		console.log(xtoken)

	if(!xtoken){
		res.status(401).send([{message: "Your authentification token is invalid", code: 'auth_token_invalid'}]);
		return;
	}

	users.get_auth_detail_from_xtoken( xtoken )
		.then(token_details => {
			session = token_details;
			console.log(session);
			return token_manager.check_if_token_is_valid( session );
		})
		.then(is_token_valid => {
			console.log(is_token_valid);

			if( is_token_valid ){
				if(session.level == 'admin'){
					next();
				}else{
					res.status(401).send([{message: "Your authentification level is invalid", code: 'auth_level_invalid'}]);
				}
			}else{
				res.status(401).send([{message: "Your authentification is expired", code: 'auth_expired'}]);
			}
			
		})
		.catch(error => {
			console.log( 'middleware_error : ', error );
		})
}

module.exports={
    'check_auth': check_auth,
    'check_admin_auth': check_admin_auth
}