const express = require('express'),
	  router = express.Router(),
	  users = require('../models/users').users;

// HELPERS

// MIDDLEWARE
var check_admin_auth = require('../middlewares/index').check_admin_auth;

router.use( check_admin_auth );

router.get('/get-users-summary',(req,res)=>{
    users.find({}, 'given_name family_name email level created_at').exec()
        .then(allUsers=>{
            res.status(200).send(allUsers);
        })
        .catch(errors=>{
            res.status(400).send(errorCheck(errors));
        });

});

// router.get('/user/search/:term', adminCheck,(req,res)=>{ //working
//     var regexedTerm = new RegExp(req.params.term, 'i');

//     Users.find(
//         {
//             $or:[
//                 {firstName: regexedTerm},
//                 {lastName: regexedTerm},
//                 {email : regexedTerm}
//             ]
//         },
//         'email firstName lastName upperLimit lowerLimit dailySpend dailyBalance createdAt dob').exec()
//         .then(found=>{
//             res.status(200).send(found);
//         })
//         .catch(errors=>{
//             res.status(400).send(errorCheck(errors));
//         });
// });

module.exports = {
	"adminRouter" : router
};