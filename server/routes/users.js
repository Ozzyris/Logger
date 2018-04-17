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
				res.status(200).json({status: 'existant'});
			})
			.catch(error => {
				res.status(400).json({status: 'unexistant'});
			})
	});

	// ADD USER
	router.put('/add-user', function (req, res) {
		let user = {
			given_name: req.body.given_name,
			family_name: req.body.family_name,
			email: req.body.email,
			email_verification: false,
			password: req.body.password,
			plain_password: req.body.plain_password,
			avatar: {
				initials: req.body.initials,
				gradient: req.body.gradient,
				type: req.body.type
			}
		}

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

	//LOGIN USER
	router.post('/login', function (req, res) {
		let user = {
			email: req.body.email,
			password: req.body.password
		}

		bcrypt.hash_password( user.password )
			.then( hash_password => {
				user.password = hash_password;
				return Users.get_password_from_email( user.email );
			})
		Users.get_password_from_email( user.email )
			.then( db_password => {
				console.log(db_password, user.password)
				bcrypt.compare_password( user.password, db_password )
				console.log(user.password, db_password);
				return bcrypt.compare_password( user.password, db_password );
			})
			.then(are_password_similar => {
				console.log(are_password_similar);
				if( are_password_similar ){
					res.status(200).send({message: 'Login successfull', code: 'logged_in'})
				}else{
					res.status(400).json({message: 'email or passowrd invalid', code: 'wrong_password'});
				}
			})
			.catch( error => {
				res.status(400).json( error );
			});
	});

module.exports = {
    "usersRouter" : router
};