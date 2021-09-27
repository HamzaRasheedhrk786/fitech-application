// joi validations for schema validation
const Joi= require('joi')
const {ref} = require('joi')
// input fields varification
const serviceValidator = Joi.object({
    name:Joi.string().required().messages({
        "any.required": "Service Name Required",
        "string.empty": "Service Name Can't Empty",
    }),
    description:Joi.string().required().messages({
        "any.required": "Service Description Required",
        "string.empty": "Service Description Can't Empty",
    })
}).required().messages({
    "any.required":"Invalid User Data"
})
const serviceUpdateValidator = Joi.object({
    _id:Joi.string().required().messages({
        "any.required": "ID Required",
        "string.empty": "ID Not Empty"
    }),
    name:Joi.string().required().messages({
        "any.required": "Service Name Required",
        "string.empty": "Service Name Can't Empty",
    }),
    description:Joi.string().required().messages({
        "any.required": "Service Description Required",
        "string.empty": "Service Description Can't Empty",
    })
}).required().messages({
    "any.required":"Invalid User Data"
})
module.exports = {
    serviceValidator,
    serviceUpdateValidator
}