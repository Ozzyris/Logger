// PACKAGES
const express = require('express'),
	  router = express.Router(),
	  fs = require('fs');


// HELPERS

router.get('/check-email/:email', function (req, res) {
	//check is email is in the db{ email: req.params }
	res.status(200).json({status: 'unexistant'});
	// res.status(200).json({status: 'existant'});
});

router.post('/add-user', function (req, res) {
	res.status(200).send(req);

	if(!req.body.given_name){
        res.status(400).send([{message: "Given name cannot be empty"}]);
        return;
    }

	var given_nama = 'banana';
	res.status(200).send(given_nama);
});

module.exports = {
    "signupRouter" : router
};