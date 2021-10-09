// joi validations for schema validation
const Joi= require('joi')
const {ref} = require('joi')
// input fields varification
const serviceValidator = Joi.object({
    name: Joi.string().pattern(new RegExp(/^[a-zA-Z]+$/)).label("name").required().messages({
        "any.required": "Service Name Required",
        "string.empty": "Invalid Service Name",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
    description:Joi.string().pattern(new RegExp(/^[a-zA-Z]+$/)).label("description").required().messages({
        "any.required": "Subscription Description Required",
        "string.empty": "Invalid Subscription Description",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
}).required().messages({
    "any.required":"Invalid User Data"
})
const serviceUpdateValidator = Joi.object({
    _id:Joi.string().required().messages({
        "any.required": "ID Required",
        "string.empty": "ID Not Empty"
    }),
    name: Joi.string().pattern(new RegExp(/^[a-zA-Z]+$/)).label("name").required().messages({
        "any.required": "Service Name Required",
        "string.empty": "Invalid Service Name",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
    description:Joi.string().pattern(new RegExp(/^[a-zA-Z]+$/)).label("description").required().messages({
        "any.required": "Service Description Required",
        "string.empty": "Invalid Service Description",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
}).required().messages({
    "any.required":"Invalid User Data"
})
module.exports = {
    serviceValidator,
    serviceUpdateValidator
}