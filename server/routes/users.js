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
		let password = req.body.password;

		console.log(password);
		bcrypt.hash_password( password )
			.then(hash_password => {
				
				console.log(hash_password);
				bcrypt.compare_password( hash_password, '$2a$10$2242I/Aexc5/CCcHUvfdL.nIpzLv1wrwdqBXImZeCs6o9ZRB9f3Me' )
					.then(result => {

						if(result == true){
							res.status(200).json({message: 'Right password'});
						}else{
							res.status(400).json({message: 'Wrong password'});
						}
						
					})
					.catch(err => { console.log(err) })

			});
	});

module.exports = {
    "usersRouter" : router
};