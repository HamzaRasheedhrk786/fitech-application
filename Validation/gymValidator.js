// joi validations for schema validation
const Joi= require('joi')
const {ref} = require('joi')
// input fields varification
const addGymValidation = Joi.object({
    ownerId:Joi.string().required().messages({
        "any.required": "Owner Required",
        "string.empty": "Owner Can't Empty",
    }),
    name:Joi.string().required().messages({
        "any.required": "Gym Name Required",
        "string.empty": "Gym Name Can't Empty",
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