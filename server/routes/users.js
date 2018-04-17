// PACKAGES
const express = require('express'),
	  router = express.Router(),
	  Users = require('../models/users').Users;

// HELPERS
var bcrypt = require('../helpers/bcrypt')


	// CHECK EMAIL
	router.get('/check-email/:email', function (req, res) {
		Users.check_if_unique_email( req.params.email )
			.then( is_email_unique => {
				res.status(200).json({status: 'unexistant'});
			})
			.catch(error => {
				res.status(400).json( error );
			})
	});

	// GET AVATAR
	router.get('/get-avatar/:email', function (req, res) {
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
				res.status(400).json( error );
			})
	});

	// SEND CONFIRMATION EMAIL
	router.get('/send_verfication_email/:email', function (req, res) {
		// console.log(req.params.email);
		//check if there is any confirmation pending
		//clear if there is any
		//create a new token with expiry date
		// send email
		res.status(200).send({ message: 'email sent' });
	});

	//LOGIN USER
	router.post('/login', function (req, res) {
		let user = {
			email: req.body.email,
			password: req.body.password
		}

		Users.get_password_from_email( user.email )
			.then( db_password => {
				return bcrypt.compare_password( user.password, db_password );
			})
			.then(are_password_similar => {
				if( are_password_similar ){
					res.status(200).send({message: 'Your login was successfull', code: 'logged_in'})
				}else{
					res.status(400).json({message: 'Your email or passowrd was invalid', code: 'wrong_password'});
				}
			})
			.catch( error => {
				res.status(400).json( error );
			});
	});

module.exports = {
    "usersRouter" : router
};