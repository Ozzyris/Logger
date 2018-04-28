// PACKAGES
const express = require('express'),
	router = express.Router(),
	moment = require('moment'),
	users = require('../models/users').users,
	config = require('../config');

// HELPERS
var bcrypt = require('../helpers/bcrypt'),
	token_manager = require('../helpers/token_manager'),
	mailer = require('../helpers/mailer');

// MIDDLEWARE
var check_auth = require('../middlewares/index').check_auth;

router.use( check_auth );

	// GET USER DETAILS FROM SESSION
	router.get('/get-user-details', function (req, res) {
		users.get_user_details_from_xtoken( req.headers['x-auth-token'] )
			.then( user => {
				res.status(200).json(user);
			})
			.catch(error => {
				res.status(401).json( error );
			})
		
	});

	// SIGNOUT WITH HEADER
	router.get('/signout-with-header', function (req, res) {
		let active_session;

		users.get_auth_detail_from_xtoken( req.headers['x-auth-token'] )
			.then(session => {
				active_session = session;
				return users.add_recorded_session( req.headers['x-auth-token'], active_session );
			})
			.then(is_recorded_session_added => {
				return users.delete_active_session( req.headers['x-auth-token'] );
			})
			.then(is_active_session_deleted => {
				res.status(200).json({ message: 'You are logged out', code:'logged_out' });
			})
			.catch(error => {
				res.status(401).json( error );
			})
	});

module.exports = {
	"userRouter" : router
};