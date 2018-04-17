var mongoose = require("./mongoose"),
    moment = require('moment'),
    bcrypt = require("../helpers/bcrypt.js"),
    Promise = require('bluebird');

var users = new mongoose.Schema({
    given_name: {type: String},
    family_name: {type: String},
    email: {type: String},
    password: {type: String},
    avatar: {
        initials: {type: String},
        gradient: [String],
        type: {type: String}
    },
    created_at: {type: Date, default: moment()},
}, {collection: 'users'});

users.statics.check_if_unique_email = function (email){
    return new Promise((resolve, reject) => {
        this.findOne({ email : email }).exec()
            .then( user => {
                if( !user ){
                    resolve( true );
                    return;
                }else{
                    reject({ error: 'Email already exist', code: 'email_duplicate'});
                }
            })
    })
};

users.statics.get_password_from_email = function( email ){
    return new Promise((resolve, reject) => {
        this.findOne({ email : email }).exec()
            .then( user => {
                if( user ){
                    resolve( user.password )
                }else{
                    reject({ error: 'Email does not exist', code: 'email_not_exist'});
                }
            })
    });
}

// users.statics.login = function(email, plaintextPassword){
//     return new Promise((resolve, reject)=>{

//         var foundUser

//         this.findOne({email: email}).exec()
//             .then(found=>{

//                 if(!found){
//                     reject({message:'Login credentials incorrect'})
//                     return
//                 }
//                 foundUser = found
//                 return bcrypt.compare(plaintextPassword, found.password)
//             })
//             .then(()=>{
//                 resolve(foundUser)
//             })
//             .catch(err=>{
//                 reject(err)
//             })

//     })
// };



// users.methods.createSession = function(){
//     return new Promise((resolve, reject)=>{
//         var token = UUID()

//         Users.update({_id: this._id}, {
//             $push:{
//                 auth: {
//                     token: token, expiration: moment().add(6,'h')
//                 }
//             }
//         }).exec()
//         .then(session =>{
//             resolve(token)
//         })
//         .catch(error=>{
//             reject(error)
//         })
//     })
// };

// users.statics.findByEmail = function(email){
//     return new Promise((resolve, reject)=>{
//         Users.findOne({email: email}).exec()
//             .then(found=>{
//                 if(!found){
//                     reject({message: 'Email not found'})
//                 }
//                 resolve(found)
//             })
//             .catch(error=>{
//                 reject(error)
//             })
//     })
// };


// users.methods.createResetPasswordToken = function(){
//     return new Promise((resolve, reject)=>{

//         var token = UUID()
//         Users.update({_id: this._id}, {$set:{
//             resetPassword:{
//                 token: token, expiration: moment().add(6,'h')
//             }
//         }
//         }).exec()
//             .then(updated=>{
//                 if(updated.n ===0){
//                     reject({message:"Couldn't create reset token"})
//                 }
//                 else{
//                     resolve(token)
//                 }
//             })
//     })
// };

// users.statics.deleteSession = function(token){
//     console.log(token)
//     return new Promise((resolve, reject)=>{
//         this.findOneAndUpdate({'auth.token': token}, {$pull:{auth:{token: token}}}).exec()
//             .then(removed=>{
//                 console.log(removed)
//                 if(removed.nModified === 0){
//                     reject({message: "Auth token not found"})
//                     return;
//                 }
//                 resolve({message: "Successfully logged out"})
//             })
//             .catch(error=>{
//                 reject(error)
//             })
//     })
// };

// users.statics.findByAuth = function(token){
//     return new Promise((resolve, reject)=>{
//         // this.findOne({'auth.token' :  token}).exec()
//         this.findOne({auth:{$elemMatch:{token: token, expiration: {$gte: moment()}}}}).exec()
//             .then(found=>{
//                 if(!found){
//                     reject({message: 'User not found', status: 401})
//                 }
//                 resolve(found)
//             })
//             .catch(error=>{
//                 reject(error)
//             })
//     })
// };

// users.statics.findByPasswordToken = function(token){
//     return new Promise((resolve, reject)=>{
//         this.findOne({'resetPassword.token': token, 'resetPassword.expiration': {$lt: moment()}}).exec()
//             .then(found=>{
//                 if(!found){
//                     reject({message: 'Token not valid'})
//                 }
//                 else{
//                     resolve(found)
//                 }
//             })
//     })
// };

// users.methods.setPassword = function(password){
//     return new Promise((resolve, reject)=>{
//         bcrypt.hash(password)
//             .then(hashedPassword=>{
//                 return Users.update({_id: this._id}, {password: hashedPassword}).exec()
//             })
//             .then(updated=>{
//                 if(updated.n ===0){
//                     reject({message: 'Oops something went wrong when updating your password'})
//                 }
//                 else{
//                     resolve({message: 'Password successfully set'})
//                 }
//             })

//     })
// };

// users.methods.clearResetPassword = function(){
//     return new Promise((resolve, reject)=>{
//         console.log(this._id)
//         Users.update({_id: this._id},{$unset:{'resetPassword.token': true,  'resetPassword.expiration': true}}).exec()
//             .then(updated=>{
//                 console.log(updated)
//                 if(updated.n === 0){
//                     reject({message: 'Oops something went wrong when clearing old password token'})
//                 }
//                 resolve(true)
//             })
//     })
// }

// users.methods.verificationEmail = Promise.method(function(url){
//     var randomStr = UUID();

//     var link = url+"/verify-email/"+randomStr

//     var mail ={
//         to: this.email,
//         subject : 'Carrott account verification',
//         html : mailer.linkEmail(
//             'Verify account',
//             'Hey from the team at yodlee<br>Thanks for signing up and using our app<br>Click the link below to verify tour yodlee account',
//             link,
//             'Verify email'
//         )
//     }

//     Users.update({_id: this._id}, {$set: {verifyEmailLink: randomStr}}).exec();
//     mailer.send(mail)
// })

var Users = mongoose.DB.model('Users', users);

module.exports.Users = Users



