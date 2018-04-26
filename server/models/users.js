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
            creation_date: {type: String},
            last_modification_date: {type: String},
            expiry_date: {type: String},
            token: {type: String},
            device_details: {
                ip: {type: String},
                country: {type: String},
                browser: {type: String},
                os: {type: String},
                device: {type: String},
            }
        },
        recorded_auth: [
            {
                creation_date: {type: String},
                last_modification_date: {type: String},
                expiry_date: {type: String},
                device_details: {
                    ip: {type: String},
                    country: {type: String},
                    browser: {type: String},
                    os: {type: String},
                    device: {type: String},
                }
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

users.statics.get_avatar_from_token = function (token){
    return new Promise((resolve, reject) => {
        this.findOne({ 'password_reset.password_token.token' : token }).exec()
            .then( user => {
                if( user ){
                    resolve( user.avatar );
                }else{
                    reject({ message: 'Your token does not exist', code: 'token_not_exist'});
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

users.statics.save_session_detail_from_id = function (session, user_id){
    return new Promise((resolve, reject) => {
        console.log(session);
        Users.update({ _id: user_id }, {
            auth_record: {
                active_auth: {
                    creation_date: moment(),
                    last_modification_date: moment(),
                    expiry_date: session.expiry_date,
                    token: session.token,
                    device_details: {
                        ip: session.device_details.ip,
                        country: session.device_details.country,
                        browser: session.device_details.browser,
                        os: session.device_details.os,
                        device: session.device_details.device,
                    }
                }
            }
        }).exec()
        .then(session =>{
            resolve(true);
        })
    });
}

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

users.statics.get_user_details_from_email = function( email ){
    return new Promise((resolve, reject) => {
        this.findOne({ email : email }).exec()
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
                        }
                    }
                    resolve( cleaned_user );
                }else{
                    reject({ message: 'Your id does not exist', code: 'id_not_exist'});
                }
            })
    });
}

users.statics.save_email_token_from_email = function( email, token ){
    return new Promise((resolve, reject) => {
        Users.update({ email: email }, {
            'email_verification.email_token':{
                token: token,
                expiration_date: moment().add(6,'h'),
                date: moment()
            }
        }).exec()
        .then(session =>{
            resolve(true);
        })
    });
}

users.statics.get_token_details = function( token ){
    return new Promise((resolve, reject) => {
        this.findOne({ 'email_verification.email_token.token': token }).exec()
            .then( user => {
                if( user ){
                    let cleaned_token = {
                        token: user.email_verification.email_token.token,
                        expiration_date: user.email_verification.email_token.expiration_date,
                        date: user.email_verification.email_token.date,
                    }
                    resolve( cleaned_token );
                }else{
                    reject({ message: 'Your token does not exist', code: 'token_not_exist'});
                }
            })
            
    });
}

users.statics.update_email_verification_from_token = function( token ){
    return new Promise((resolve, reject) => {
        Users.update({ 'email_verification.email_token.token': token }, {
            'email_verification.is_email_verified': true
        }).exec()
        .then(session =>{
            resolve(true);
        })
    });
}

users.statics.delete_email_token_from_token = function( token ){
    return new Promise((resolve, reject) => {
        Users.update({ 'email_verification.email_token.token': token }, {
            $unset:{
                'email_verification.email_token.token': '',
                'email_verification.email_token.expiration_date': '',
                'email_verification.email_token.date': ''
            }
        }).exec()
        .then(session =>{
            resolve(true);
        })
    });
}

// FORGOT PASSWORD
users.statics.save_password_token_from_email = function( email, token ){
    return new Promise((resolve, reject) => {
        Users.update({ email: email }, {
            'password_reset':{
                is_password_being_reset: true,
                password_token:{
                    token: token,
                    expiration_date: moment().add(6,'h'),
                    date: moment()
                }
            }
        }).exec()
        .then(session =>{
            resolve(true);
        })
    });
}

users.statics.get_token_details_from_token = function( token ){
    return new Promise((resolve, reject) => {
        this.findOne({ 'password_reset.password_token.token': token }).exec()
            .then( user => {
                if( user ){
                    let cleaned_token = {
                        token: user.password_reset.password_token.token,
                        expiration_date: user.password_reset.password_token.expiration_date,
                        date: user.password_reset.password_token.date,
                    }
                    resolve( cleaned_token );
                }else{
                    reject({ message: 'Your token does not exist', code: 'token_not_exist'});
                }
            })
    });
}

users.statics.update_password_from_token = function( password_details ){
    return new Promise((resolve, reject) => {
        console.log(password_details);
        Users.update({'password_reset.password_token.token': password_details.token }, {
            'password_reset.is_password_being_reset': false,
            password: password_details.password
        }).exec()
        .then(session =>{
            resolve(true);
        })
    });
}

users.statics.delete_password_token_from_token = function( token ){
    return new Promise((resolve, reject) => {
        Users.update({ 'password_reset.password_token.token': token }, {
            $unset:{
                'password_reset.password_token.token': '',
                'password_reset.password_token.expiration_date': '',
                'password_reset.password_token.date': ''
            }
        }).exec()
        .then(session =>{
            resolve(true);
        })
    });
}

var Users = mongoose.DB.model('Users', users);

module.exports.Users = Users



