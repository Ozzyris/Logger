// PACKAGES
const express = require('express'),
	router = express.Router(),
	Users = require('../models/users').Users,
	config = require('../config');

// HELPERS
var bcrypt = require('../helpers/bcrypt'),
	token_manager = require('../helpers/token_manager'),
	mailer = require('../helpers/mailer');

	// CHECK EMAIL
	router.get('/check-email/:email', function (req, res) {
		Users.check_if_unique_email( req.params.email )
			.then( is_email_unique => {
				res.status(200).json({status: 'unexistant'});
			})
			.catch(error => {
				res.status(401).json( error );
			})
	});

	// GET AVATAR
	router.get('/get-avatar-from-email/:email', function (req, res) {
		Users.get_avatar_from_email( req.params.email )
			.then( is_email_unique => {
				res.status(200).json(is_email_unique);
			})
			.catch(error => {
				res.status(401).json( error );
			})
	});

	// ADD USER
	router.put('/create-user', function (req, res) {
		let user = req.body;

		Users.check_if_unique_email( user.email )
			.then( is_email_unique => {
				return bcrypt.hash_password( user.password );
			})
			.then( hash_password => {
				user.password = hash_password;
				return new Users(user).save()
			})
			.then( inserted => {
				res.status(200).send({ user_id: inserted._id })
			})
			.catch( error => {
				res.status(401).json( error );
			})
	});

	// SEND CONFIRMATION EMAIL
	router.get('/send-verfication-from-email/:email', function (req, res) {

		token_manager.create_email_token()
			.then(token => {
				email_token = token;
				return Users.save_email_token_from_email( req.params.email, token );
			})
			.then(is_saved_token => {
				return Users.get_user_details_from_email( req.params.email )
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
				console.log(is_email_send);
				res.status(200).json({ message: 'Your verification email has been send', code: 'verification_email_send' });
			})
			.catch(error => {
				res.status(401).json( error );
			})
	});

	// CHECK IF VERIFICATION EMAIL TOKEN IS VALID
	router.get('/check_verification_email_token/:token', function (req, res) {
		Users.get_token_details( req.params.token )
			.then( token_details => {
				return token_manager.check_if_token_is_valid( token_details );
			})
			.then( is_token_valid => {
				res.status(200).json( is_token_valid );
			})
			.catch(error => {
				res.status(401).json( error );
			})
		
	});

	//LOGIN USER
	router.post('/login-with-credentials', function (req, res) {
		let user = {
			email: req.body.email,
			password: req.body.password
		}

		Users.get_password_from_email( user.email )
			.then( db_password => {
				return bcrypt.compare_password( user.password, db_password );
			})
			.then(are_password_similar => {
				if(are_password_similar){
					return Users.get_user_id_from_email( user.email );
				}else{
					res.status(401).json({message: 'Your email or passowrd was invalid', code: 'wrong_password'});
				}
			})
			.then(user_id => {
				res.status(200).json({ user_id: user_id });
			})
			.catch( error => {
				res.status(401).json( error );
			});
	});

	// LOGOUT WITH HEADER
	router.get('/logout-with-header', function (req, res) {
		res.status(200).json({ message: 'You are logged out', code:'logged_out' });
	});

	// GET USER DETAILS FROM ID
	router.get('/get-user-details-from-id/:id', function (req, res) {
		Users.get_user_details_from_id( req.params.id )
			.then( user => {
				res.status(200).json(user);
			})
			.catch(error => {
				res.status(401).json( error );
			})
		
	});

module.exports = {
    "usersRouter" : router
};