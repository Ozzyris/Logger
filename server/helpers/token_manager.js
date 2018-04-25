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

function create_jwt_token( details ){
	if (typeof details !== 'object'){ //CREATE A OBJECT IF NONE
		details = {}
	}
	if (!details.maxAge || typeof details.maxAge !== 'number'){ //CREATE A TIMESTAMP IF NONE
		details.maxAge = 3600
	}
	if(!details.payload || typeof details !== 'object'){ // CREATE A PAYLOAD IF NONE
		details.payload = {}
	}

	let token = jwt.sign({
			data: details.payload
		}, config.ket_secret, {
		expiresIn: details.maxAge,
		algorithm: 'HS256'
	})
  	return token
}

function check_if_jwt_token_is_valid( token ){
	return new Promise((resolve, reject)=>{
		jwt.verify(token, config.ket_secret, (err, decodedToken) => {
			if (err || !decodedToken){
				return reject(err)
			}

			resolve(decodedToken)
		})
	})
}

module.exports={
    'create_token': create_token,
    'check_if_token_is_valid': check_if_token_is_valid,
    'create_jwt_token': create_jwt_token,
    'check_if_jwt_token_is_valid': check_if_jwt_token_is_valid
}