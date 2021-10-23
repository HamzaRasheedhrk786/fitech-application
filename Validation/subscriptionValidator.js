const Joi=require('joi');

// subscription Validation Schema
const subscriptionValidation=Joi.object({
    name: Joi.string().pattern(new RegExp(/^[a-zA-Z\s]*$/)).label("name").required().messages({
        "any.required": "Subscription Name Required",
        "string.empty": "Invalid Subscription Name",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
    description:Joi.string().pattern(new RegExp(/^[a-zA-Z\s]*$/)).label("description").required().messages({
        "any.required": "Subscription Description Required",
        "string.empty": "Invalid Subscription Description",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
    amount:Joi.number().required().messages({
        "string.empty": "Event amount Required",
        "any.required": "Invalid amount"

    })
    
}).required().messages({
    "any.required": "Invalid Subscription Data"
})
// Event Validation Schema
// const eventValidation=Joi.object({
//     name:Joi.string().required().messages({
//         "string.empty": "Event Name Required",
//         "any.required": "Invalid Event Name"
//     }),
//     description:Joi.string().required().messages({
//         "string.empty": "Event Description Required",
//         "any.required": "Invalid Description"
//     }),
//     amount:Joi.number().required().messages({
//         "string.empty": "Event amount Required",
//         "any.required": "Invalid amount"

//     })
// }).required().messages({
//     "any.required": "Invalid Event Data"
// })
// Event Edit Validation Schema
const subscriptionEdit=Joi.object({
    _id:Joi.string().required().messages({
        "any.required": "Id Required"
    }),
    name: Joi.string().pattern(new RegExp(/^[a-zA-Z\s]*$/)).label("name").required().messages({
        "any.required": "Subscription Name Required",
        "string.empty": "Invalid Subscription Name",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
    description:Joi.string().pattern(new RegExp(/^[a-zA-Z\s]*$/)).label("description").required().messages({
        "any.required": "Subscription Description Required",
        "string.empty": "Invalid Subscription Description",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
    amount:Joi.number().required().messages({
        "string.empty": "Event amount Required",
        "any.required": "Invalid amount"

    }),
    // image:Joi.string().required().messages({
    //     "string.empty": "Image Required",
    //     "any.required": "Invalid Image"
    // }),

}).required().messages({
    "any.required": "Invalid Event Edit Data"
})
// Event Edit Validation Schema
const subscriptionAssignment=Joi.object({
    _id:Joi.string().required().messages({
        "any.required": "Id Required"
    }),
    userId:Joi.string().required().messages({
        "any.required": "Id Required"
    }),
    
    // image:Joi.string().required().messages({
    //     "string.empty": "Image Required",
    //     "any.required": "Invalid Image"
    // }),

}).required().messages({
    "any.required": "Invalid Event Edit Data"
})
module.exports=
{
    subscriptionValidation,
    subscriptionEdit,
    subscriptionAssignment
}