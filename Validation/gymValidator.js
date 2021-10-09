// joi validations for schema validation
const Joi= require('joi')
const {ref} = require('joi')
// input fields varification
const addGymValidation = Joi.object({
    images:Joi.string().messages({
        "any.required": "Image File Required",
        // "string.empty": "Image File Can't Empty",
    }),
    ownerId:Joi.string().required().messages({
        "any.required": "Owner Required",
        "string.empty": "Owner Can't Empty",
    }),
    name: Joi.string().pattern(new RegExp(/^[a-zA-Z]+$/)).label("name").required().messages({
        "any.required": "First Name Required",
        "string.empty": "Invalid First Name",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
    city:Joi.string().required().messages({
        "any.required": "Gym Name Required",
        "string.empty": "Gym Name Can't Empty",
    }),
    contactNumber:Joi.string().min(11).max(11).required().messages({
        "any.required": "Conatct Number Required",
        "string.empty": "Contact Number Can't Empty",
    }),
    monthlyFee:Joi.number().required().messages({
        "any.required": "Monthly Fee Required",
        "string.empty": "Montly Fee Can't Empty",
    }),
    gymAddress:Joi.string().required().messages({
        "any.required": "Gym Address Required",
        "string.empty": "Gym Address Can't Empty",
    }),
    services:Joi.array().items(Joi.string()).required().messages({
        "any.required": "Service Required",
        // "string.empty": "Service Not Empty"
    })
    
}).required().messages({
    "any.required":"Invalid User Data"
})
// uodating gym
const updateGymValidation = Joi.object({
    _id:Joi.string().required().messages({
        "any.required": "id Required",
        "string.empty": "id Can't Empty",
    }),
    // gymAddress:Joi.string().required().messages({
    //     "any.required": "Gym Address Required",
    //     "string.empty": "Gym Address Can't Empty",
    // })
    
}).required().messages({
    "any.required":"Invalid Gym Data"
})
module.exports = {
    addGymValidation,
    updateGymValidation
}