var jwt = require('jsonwebtoken'),
	uniqueid = require('uniqid'),
	Promise = require('bluebird'),
	config = require('../config');

function create_email_token(){
	return new Promise((resolve, reject)=>{
		resolve(uniqueid());
	})
}

function check_if_token_is_valid( token_details ){
	return new Promise((resolve, reject)=>{
		console.log(moment(token_details.expiration_date).format('dddd'));
		// console.log(moment(token_details.expiration_date).isAfter());
		// resolve();
	})
}

module.exports={
    'create_email_token': create_email_token,
    'check_if_token_is_valid': check_if_token_is_valid
}