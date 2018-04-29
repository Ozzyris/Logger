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
            expiration_date: {type: String},
            keep_session: {type: Boolean, default: false},
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
                ending_date: {type: String},
                keep_session: {type: String},
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

users.statics.check_email = function (email){
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

// AVATAR
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


// GET USER DETAILS
users.statics.get_user_details_from_xtoken = function( xtoken ){
    return new Promise((resolve, reject) => {
        this.findOne({ 'auth_record.active_auth.token': xtoken }).exec()
            .then( user => {
                if( user ){
                    let cleaned_user = {
                        given_name: user.given_name,
                        family_name: user.family_name,
                        email: user.email,
                        level: user.level,
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
                    reject({ message: 'Your session does not exist', code: 'xtoken_not_exist'});
                }
            })
    });
}

// EMAIL VERIFICATION
users.statics.save_email_token_from_xtoken = function( xtoken, token ){
    return new Promise((resolve, reject) => {
        users.update({ 'auth_record.active_auth.token': xtoken }, {
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
        users.update({ 'email_verification.email_token.token': token }, {
            'email_verification.is_email_verified': true
        }).exec()
        .then(session =>{
            resolve(true);
        })
    });
}
users.statics.delete_email_token_from_token = function( token ){
    return new Promise((resolve, reject) => {
        users.update({ 'email_verification.email_token.token': token }, {
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
        users.update({ email: email }, {
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
        users.update({'password_reset.password_token.token': password_details.token }, {
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
        users.update({ 'password_reset.password_token.token': token }, {
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


//SIGNIN
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
users.statics.save_session_detail_from_id = function (session, user_id){
    return new Promise((resolve, reject) => {
        users.update({ _id: user_id }, {
            auth_record: {
                active_auth: {
                    creation_date: moment(),
                    last_modification_date: moment(),
                    expiration_date: session.expiration_date,
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
users.statics.get_auth_detail_from_xtoken = function( xtoken ){
    return new Promise((resolve, reject) => {
        this.findOne({ 'auth_record.active_auth.token': xtoken }).exec()
            .then( user => {
                if( user ){
                    let cleaned_token = {
                        level: user.level,
                        creation_date: user.auth_record.active_auth.creation_date,
                        last_modification_date: user.auth_record.active_auth.last_modification_date,
                        expiration_date: user.auth_record.active_auth.expiration_date,
                        token: user.auth_record.active_auth.token,
                        keep_session: user.auth_record.active_auth.keep_session,
                        device_details: user.auth_record.active_auth.device_details
                    }
                    resolve( cleaned_token );
                }else{
                    reject({ message: 'Your session does not exist', code: 'xtoken_not_exist'});
                }
            })
    });
}
users.statics.update_token_timestamp_from_xtoken = function( xtoken, session ){
    return new Promise((resolve, reject) => {
        users.update({ 'auth_record.active_auth.token': xtoken }, {
            'auth_record.active_auth.last_modification_date': moment(),
            'auth_record.active_auth.expiration_date': session.expiration_date,
        }).exec()
        .then(session =>{
            resolve(true);
        })
    });
}


//SIGNOUT
users.statics.add_recorded_session = function( xtoken, session ){
    return new Promise((resolve, reject) => {
        users.update({ 'auth_record.active_auth.token': xtoken }, {
            $push:{
                'auth_record.recorded_auth': {
                    creation_date: session.creation_date,
                    last_modification_date: session.last_modification_date,
                    ending_date: moment(),
                    keep_session: session.keep_session,
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
users.statics.delete_active_session = function( xtoken ){
    return new Promise((resolve, reject) => {
        users.update({ 'auth_record.active_auth.token': xtoken }, {
            $unset:{
                'auth_record.active_auth': ''
            }
        }).exec()
        .then(session =>{
            resolve(true);
        })
    });
}


var users = mongoose.DB.model('users', users);

module.exports.users = users



