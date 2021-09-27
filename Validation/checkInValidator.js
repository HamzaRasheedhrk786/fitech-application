// joi validations for schema validation
const Joi= require('joi')
// const {ref} = require('joi')
// input fields varification
const addCheckInValidation = Joi.object({
    gym:Joi.string().required().messages({
        "any.required": "Gym Required",
        "string.empty": "Gym Can't Empty",
    }),
    user:Joi.string().required().messages({
        "any.required": "User Required",
        "string.empty": "User Can't Empty",
    }),
    
}).required().messages({
    "any.required":"Invalid User Data"
})
module.exports = {
    addCheckInValidation
}