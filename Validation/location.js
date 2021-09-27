const Joi=require('joi');

// subscription Validation Schema
const locationValidation=Joi.object({
    userId:Joi.string().required().messages({
        "any.required": "Id Required"
    }),
    // location:Joi.object().required().messages({
    //     "object.empty": "location object Required",
    //     "any.required": "Invalid object"
    // })
    
}).required().messages({
    "any.required": "Invalid location Data"
})

module.exports=
{
locationValidation
}