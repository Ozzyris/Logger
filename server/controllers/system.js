// PACKAGES
const express = require('express'),
	router = express.Router(),
	moment = require('moment'),
	Users = require('../models/users').Users,
	config = require('../config');

// HELPERS
var bcrypt = require('../helpers/bcrypt'),
	token_manager = require('../helpers/token_manager'),
	mailer = require('../helpers/mailer');

// MIDDLEWARE
var check_auth = require('../middleware/index').check_auth;

router.use( check_auth );


	// GET USER DETAILS FROM SESSION / ID
	router.get('/get-user-details-from-id/:id', function (req, res) {
		Users.get_user_details_from_id( req.params.id )
			.then( user => {
				res.status(200).json(user);
			})
			.catch(error => {
				res.status(401).json( error );
			})
		
	});