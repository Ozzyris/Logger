const express = require('express'),
	  router = express.Router();

// HELPERS

// MIDDLEWARE
var check_auth = require('../middlewares/index').check_auth;

router.use( check_auth );

module.exports = {
	"contentRouter" : router
};