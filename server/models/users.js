var mongoose = require("./mongoose"),
    moment = require('moment'),
    bcrypt = require("../helpers/bcrypt.js"),
    Promise = require('bluebird');

var users = new mongoose.Schema({
    given_name: {type: String},
    family_name: {type: String},
    email: {type: String},
    password: {type: String},
    created_at: {type: Date, default: moment()},
    level: {type: String, default: 'basic'},
    avatar: {
        initials: {type: String},
        gradient: [String],
        type: {type: String}
    },
    email_verification: {
        is_email_verified: {type: Boolean, default: false},
        email_token:{
            token: {type: String},
            expiration_date: {type: String},
            date: {type: String}
        }
    },
    password_reset: {
        is_password_being_reset: {type: Boolean, default: false},
        password_token:{
            token: {type: String},
            expiration_date: {type: String},
            date: {type: String}
        }
    },
    auth_record: {
        active_auth: {
            ip: {type: String},
            location: {type: String},
            browser: {type: String},
            date: {type: String},
            expiration_date: {type: String},
            token: {type: String},

        },
        recorded_auth: [
            {
                ip: {type: String},
                location: {type: String},
                browser: {type: String},
                date: {type: String}
            }
        ]
    }
}, {collection: 'users'});

users.statics.check_if_unique_email = function (email){
    return new Promise((resolve, reject) => {
        this.findOne({ email : email }).exec()
            .then( user => {
                if( !user ){
                    resolve( true );
                }else{
                    reject({ message: 'Your email already exist', code: 'email_duplicate'});
                }
            })
    })
};

users.statics.get_avatar_from_email = function (email){
    return new Promise((resolve, reject) => {
        this.findOne({ email : email }).exec()
            .then( user => {
                if( user ){
                    resolve( user.avatar );
                }else{
                    reject({ message: 'Your email does not exist', code: 'email_not_exist'});
                }
            })
    })
};

users.statics.get_user_id_from_email = function (email){
    return new Promise((resolve, reject) => {
        this.findOne({ email : email }).exec()
            .then( user => {
                if( user ){
                    resolve( user._id );
                }else{
                    reject({ message: 'Your email does not exist', code: 'email_not_exist'});
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
                    reject({ message: 'Your email does not exist', code: 'email_not_exist'});
                }
            })
    });
}

users.statics.get_user_details_from_id = function( id ){
    return new Promise((resolve, reject) => {
        this.findOne({ _id : id }).exec()
            .then( user => {
                if( user ){
                    let cleaned_user = {
                        given_name: user.given_name,
                        family_name: user.family_name,
                        email: user.email,
                        avatar: {
                            gradient: user.avatar.gradient,
                            initials: user.avatar.initials,
                            type: user.avatar.type,
                        },
                        email_verification: {
                            is_email_verified: user.email_verification.is_email_verified,
                        }
                    }
                    resolve( cleaned_user );
                }else{
                    reject({ message: 'Your id does not exist', code: 'id_not_exist'});
                }
            })
    });
}

users.statics.check_active_email_token = function( email ){
    return new Promise((resolve, reject) => {
        this.findOne({ email : email }).exec()
            .then( user => {
                console.log(user) 
                if( user.email_verification.email_token.token ){
                    resolve( true );
                }else{
                    resolve( false );
                }

            })
    });
}

users.method.create_email_token = function(){
    return new Promise((resolve, reject) => {
        
    });
}

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

// users.statics.findBySession = function(token){
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

var Users = mongoose.DB.model('Users', users);

module.exports.Users = Users



