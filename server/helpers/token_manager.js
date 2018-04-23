var jwt = require('jsonwebtoken'),
	uniqueid = require('uniqid'),
	Promise = require('bluebird'),
	config = require('../config'),
	moment = require('moment');

function create_token(){
	return new Promise((resolve, reject)=>{
		resolve(uniqueid());
	})
}

function check_if_token_is_valid( token_details ){
	return new Promise((resolve, reject)=>{
		resolve(moment.unix(token_details.expiration_date/1000).isAfter());
	})
}

module.exports={
    'create_token': create_token,
    'check_if_token_is_valid': check_if_token_is_valid
}