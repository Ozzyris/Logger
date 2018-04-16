// PACKAGES
const express = require('express'),
	  router = express.Router();

// HELPERS
var bcrypt = require('../helpers/bcrypt')


	// CHECK EMAIL
	router.get('/check-email/:email', function (req, res) {
		//check is email is in the db{ email: req.params }
		res.status(200).json({status: 'unexistant'});
		// res.status(200).json({status: 'existant'});
	});

	// ADD USER
	router.post('/add-user', function (req, res) {
		if(!req.body.given_name){
			res.status(400).send([{message: "Given name cannot be empty"}]);
			return;
		}

		let given_name = req.body.given_name;

		bcrypt.hash_password( given_name )
			.then(hash_email => {
				res.status(200).send( hash_email );
			});
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