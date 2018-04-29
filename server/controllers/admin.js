const express = require('express'),
	  router = express.Router();

// HELPERS

// MIDDLEWARE
var check_auth = require('../middlewares/index').check_auth;

router.use( check_auth );

// router.get('/users', adminCheck,(req,res)=>{//working

//     Users.find({}, 'email firstName lastName createdAt').exec()
//         .then(allUsers=>{
//             res.status(200).send(allUsers);
//         })
//         .catch(errors=>{
//             res.status(400).send(errorCheck(errors));
//         });

// });

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