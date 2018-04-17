var bcrypt = require('bcryptjs'),
    Promise = require('bluebird')

function hash_password( plain_password ){
    return new Promise((resolve, reject)=>{
        bcrypt.genSalt(10, function(err, salt) {
            if(err){
                reject(err)
                return
            }
            bcrypt.hash(plain_password, salt, function(err, hash) {
                if(err){
                    reject(err)
                    return
                }
                resolve(hash)
            });
        });
    })
}

function compare_password( first_hash, second_hash ){
function compare_password( plain_password, db_password ){
    return new Promise((resolve, reject)=>{
        bcrypt.compare(first_hash, second_hash, function(err, res) {
        bcrypt.compare(plain_password, db_password, function(err, res) {
            if(err){
                reject(err)
                return
            }
            else if(res === false){
                resolve(res)
            }
            resolve(res)
        });
    })
}

module.exports={
    'hash_password': hash_password,
    'compare_password' : compare_password,
    bcrypt : bcrypt
}