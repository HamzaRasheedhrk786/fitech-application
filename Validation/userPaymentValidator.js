// joi validations for schema validation
const Joi= require('joi')
const {ref} = require('joi')
// input fields varification
const paymentValidationUser = Joi.object({
    userId:Joi.string().required().messages({
        "any.required": "UserID Required",
        "string.empty": "UserID Cant Empty",
    }),
    subscriptionId:Joi.string().required().messages({
        "any.required": "SubscriptionID Required",
        "string.empty": "SubscriptionID Cant Empty",
    }),
    // amount:Joi.string().required().messages({
    //     "string.empty": "Description Required",
    //     "any.required": "Invalid Description"
    // }),
}).required().messages({
    "any.required":"Invalid User Data"
})
module.exports = {
    paymentValidationUser
}