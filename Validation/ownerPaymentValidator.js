// joi validations for schema validation
const Joi= require('joi')
const {ref} = require('joi')
// input fields varification
const OwnerPaymentValidation = Joi.object({
    owner:Joi.string().required().messages({
        "any.required": "Owner Required",
        "string.empty": "Owner Can't Empty",
    }),
    gym:Joi.string().required().messages({
        "any.required": "Gym Required",
        "string.empty": "Gym Can't Empty",
    }),
    images:Joi.string().messages({
        "any.required": "Image File Required",
        // "string.empty": "Image File Can't Empty",
    }),
    amount:Joi.number().messages({
        "any.required": "amount Required",
        "string.empty": "amount Can't Empty",
    })
    
}).required().messages({
    "any.required":"Invalid User Data"
})

module.exports = {
    OwnerPaymentValidation,
}