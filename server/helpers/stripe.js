/**
 * Created by ihsanmujdeci on 3/05/2017.
 */

const apiEndpoint = "https://api.stripe.com";

console.log('Stripe Secret: ', process.env.stripe.secret);

var stripe = require('stripe')(process.env.stripe.secret);

function charge(amount, source) {
    return new Promise((resolve, reject)=> {
        stripe.charges.create({
	    
            amount: amount,
            source: source,
            currency: 'aud',
            expand: ["balance_transaction"]
        }, (err, charge)=> {
            if (err)
                reject(err);
            else
                resolve(charge);
        })
    })
}

// (async function(){
//     var c = await charge(100, "tok_visa");
//
//     console.log(c)
// })();

function getCharge(id){
    return new Promise((resolve, reject)=> {
        stripe.charges.retrieve(id,
            (err, charge)=> {
                if (err)
                    reject(err);
                else
                    resolve(charge);
            }
        );
    })
}

function chargeCustomer(amount, customerId, uniqueCustomerId) {
    return new Promise((resolve, reject)=> {
        stripe.charges.create({
	    description: uniqueCustomerId,
            amount: amount,
            customer: customerId,
            currency: 'aud',
            expand: ["balance_transaction"]
        }, (err, charge)=> {
            if (err)
                reject(err);
            else
                resolve(charge);
        });
    });
}

/*

 balance_transaction:
 { id: 'txn_1AqYIbJTTLQ5QwDdE39SvbPG',
 object: 'balance_transaction',
 amount: 100,
 available_on: 1503273600,
 created: 1502677645,
 currency: 'aud',
 description: null,
 fee: 33,
 fee_details: [ [Object], [Object] ],
 net: 67,
 source: 'ch_1AqYIbJTTLQ5QwDd26115jbi',
 status: 'pending',
 type: 'charge' },

 */

function createCustomer(source, customerNumber, customerUniqueId){
    // customerUniqueId generated at user creation as uniqueId
    return new Promise((resolve,reject)=>{
        stripe.customers.create({
            description: customerUniqueId,
            source: source, // obtained with Stripe.js
            metadata: {customerNumber: customerNumber}
        }, function(err, customer) {
            if(err)
                reject(err)
            else
                resolve(customer)
        });
    })
}

// createCustomer("tok_visa", "12324")
//     .then(res=>{
//         console.log(res)
//     })
//     .catch(err=>{
//         console.log(err)
//     })


function getCustomer(id){
    return new Promise((resolve, reject)=>{
        stripe.customers.retrieve(id,
            (err, customer)=>{
               if(err)
                   reject(err)
               else
                   resolve(customer)
            }
        );
    })
}

function deleteCard(customerId, cardId){
    return new Promise((resolve, reject)=>{
        stripe.customers.deleteCard(
            customerId,
            cardId,
            (err, confirmation)=> {
                if(err)
                    reject(err)
                else
                    resolve(confirmation)
            }
        );
    })
}

function updateCustomer(customerId, changeObj){
    return new Promise((resolve, reject)=>{
        stripe.customers.update(customerId, changeObj,
            (err, customer)=> {
                if(err)
                    reject(err)
                else
                    resolve(customer)
            });
    })

}
/*
Used to extrapolate card data from customer object
 */
function getCardDetails(obj){
    var card = obj.sources.data[0];
    return {last4: card.last4, month: card.exp_month, year: card.exp_year, brand: card.brand, name: card.name}
}
function getFirstCardId(obj){
    return obj.sources.data[0].id
}
//
// getCustomer("cus_BAPuZcY9btAL4i")
//     .then(res=>{
//         console.log('USER');
//         console.log(res);
//         console.log('CARDS');
//         console.log(res.sources)
//         console.log(getCardDetails(res))
//         //console.log('thingo: ',getFirstCardId(res))
//     })



module.exports={
    charge,
    createCustomer,
    chargeCustomer,
    getCustomer,
    getCardDetails,
    deleteCard,
    updateCustomer,
    getFirstCardId
}


