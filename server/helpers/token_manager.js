var jwt = require('jsonwebtoken'),
	uniqueid = require('uniqid'),
    Promise = require('bluebird'),
    config = require('../config');

function create_email_token(){
    return new Promise((resolve, reject)=>{
		resolve(uniqueid());
    })
}

module.exports={
    'create_email_token': create_email_token
}