// PACKAGES
const express = require('express'),
	  router = express.Router(),
	  moment = require('moment'),
	  users = require('../models/users').users,
	  config = require('../config');

// HELPERS
const bcrypt = require('../helpers/bcrypt'),
	  token_manager = require('../helpers/token_manager'),
	  mailer = require('../helpers/mailer');

	// GENRAL
	router.get('/check-email/:email', function (req, res) {
		users.check_email( req.params.email )
			.then( is_email_unique => {
				res.status(200).json({status: 'unexistant'});
			})
			.catch(error => {
				res.status(401).json( error );
			})
	});
	router.get('/get-avatar-from-email/:email', function (req, res) {
		users.get_avatar_from_email( req.params.email )
			.then( avatar_details => {
				res.status(200).json(avatar_details);
			})
			.catch(error => {
				res.status(401).json( error );
			})
	});
	router.get('/get-avatar-from-token/:token', function (req, res) {
		users.get_avatar_from_token( req.params.token )
			.then( avatar_details => {
				res.status(200).json(avatar_details);
			})
			.catch(error => {
				res.status(401).json( error );
			})
	});

	// SIGN UP
	router.put('/signup-with-credentials', function (req, res) {
		let user = {
			given_name: req.body.given_name,
			family_name: req.body.family_name,
			email: req.body.email,
			password: req.body.password,
			avatar: {
   				type: req.body.avatar.type,
     			gradient: req.body.avatar.gradient,
     			initials: req.body.avatar.initials
     		}
		},
		session = {
			token: '',
			expiration_date: '',
			keep_session: false,
			device_details: {
				ip: req.body.device_details.ip,
				country: req.body.device_details.country,
				browser: req.body.device_details.browser,
				os: req.body.device_details.os,
				device: req.body.device_details.device
			}
		};

		users.check_email( user.email )
			.then( is_email_unique => {
				return bcrypt.hash_password( user.password );
			})
			.then( hash_password => {
				user.password = hash_password;
				return new users(user).save()
			})
			.then( user_saved => {
				user.id = user_saved._id;
				session.token = token_manager.create_session_token();
				session.expiration_date = moment().add(1,'day');

				return users.save_session_detail_from_id( session, user_saved._id );
			})
			.then( is_session_saved => {
				res.status(200).send({ session: session.token })
			})
			.catch( error => {
				res.status(401).json( error );
			})
	});

	// SIGN IN
	router.post('/signin-with-credentials', function (req, res) {
		let user = {
			email: req.body.email,
			password: req.body.password,
			stay_loggedin : req.body.stay_loggedin
		},
			session = {
			token: '',
			expiration_date: '',
			keep_session: req.body.stay_loggedin,
			device_details: {
				ip: req.body.device_details.ip,
				country: req.body.device_details.country,
				browser: req.body.device_details.browser,
				os: req.body.device_details.os,
				device: req.body.device_details.device
			}
		};

		users.get_password_from_email( user.email )
			.then( db_password => {
				return bcrypt.compare_password( user.password, db_password );
			})
			.then(are_password_similar => {
				if(are_password_similar){
					return users.get_user_id_from_email( user.email );
				}else{
					res.status(401).json({message: 'Your email or passowrd was invalid', code: 'wrong_password'});
				}
			})
			.then(user_id => {
				session.token = token_manager.create_session_token();

				if( user.stay_loggedin ){
					session.expiration_date = moment().add(7,'day');
				}else{
					session.expiration_date = moment().add(1,'day');
				}
				return users.save_session_detail_from_id( session, user_id );
			})
			.then(is_session_saved => {
				res.status(200).json({ session: session.token });
			})
			.catch( error => {
				res.status(401).json( error );
			});
	});

	// VERIFY EMAIL NOT WORKING
	router.get('/send-verification-email', function (req, res) {
		let email_token;

		token_manager.create_token()
			.then(token => {
				email_token = token;
				return users.save_email_token_from_xtoken( req.headers['x-auth-token'], token );
			})
			.then(is_saved_token => {
				return users.get_user_details_from_xtoken( req.headers['x-auth-token'] );
			})
			.then(user_details => {
				let url = config.front_end_url + 'email-verification/' + email_token;
				return mailer.build_email_verification(url, user_details);
			})
			.then(html => {
				let subject = 'Verify your email for Logger';
				return mailer.send_email( subject ,html );
			})
			.then(is_email_send => {
				res.status(200).json({ message: 'Your verification email has been send', code: 'verification_email_send' });
			})
			.catch(error => {
				res.status(401).json( error );
			})
	});
	router.get('/check-verification-email-token/:token', function (req, res) {
		users.get_token_details( req.params.token )
			.then( token_details => {
				return token_manager.check_if_token_is_valid( token_details );
			})
			.then( is_token_valid => {
				if(is_token_valid){
					return users.update_email_verification_from_token( req.params.token );
				}else{
					res.status(401).json({ message: 'Your token is expired, please send another verification mail', code: 'token_expired' });
				}
			})
			.then(is_email_verification_updated => {
				return users.delete_email_token_from_token( req.params.token );
			})
			.then(is_email_token_deleted => {
				res.status(200).json({ message: 'Your email has been verified', code: 'email_verified' });
			})
			.catch(error => {
				res.status(401).json( error );
			})
	});

	// FORGOT PASSWORD
	router.get('/send-forgot-password-from-email/:email', function (req, res) {
		let password_token,
			given_name;

		token_manager.create_token()
			.then(token => {
				password_token = token;
				return users.save_password_token_from_email( req.params.email, token );
			})
			.then(is_saved_token => {
				return users.get_user_details_from_email( req.params.email )
			})
			.then(user_details => {
				let url = config.front_end_url + 'set-password/' + password_token;
				given_name = user_details.given_name;
				return mailer.build_email_forgot_password(url, user_details);
			})
			.then(html => {
				let subject = 'Forgot your password ' + given_name + '?';
				return mailer.send_email( subject ,html );
			})
			.then(is_email_send => {
				res.status(200).json({ message: 'Your forgot password email has been send', code: 'forgot_password_email_send' });
			})
			.catch(error => {
				console.log(error);
				res.status(401).json( error );
			})
	});
	router.post('/set-password', function (req, res) {
		let password_details = {
			token: req.body.token,
			password: req.body.password
		}

		users.get_token_details_from_token( password_details.token )
			.then( token_details => {
				return token_manager.check_if_token_is_valid( token_details );
			})
			.then(is_token_valid => {
				if(is_token_valid){
					return bcrypt.hash_password( password_details.password );
				}else{
					res.status(401).json({ message: 'Your token is expired, please start over', code: 'token_expired' });
				}
			})
			.then(password_hash => {
				password_details.password = password_hash;
				return users.update_password_from_token( password_details );
			})
			.then(is_password_updated => {
				return users.delete_password_token_from_token( password_details.token );
			})
			.then(is_token_deleted => {
				res.status(200).json({ message: 'Your password has been updated', code: 'password_updated' });
			})
			.catch( error => {
				res.status(401).json( error );
			});
	});

module.exports = {
	"authRouter" : router
};