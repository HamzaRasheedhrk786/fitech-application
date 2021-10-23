// joi validations for schema validation
const Joi= require('joi')
const {ref} = require('joi')
// input fields varification
const signUpValidationOwner = Joi.object({
    name: Joi.string().pattern(new RegExp(/^[a-zA-Z\s]*$/)).label("name").required().messages({
        "any.required": " Name Required",
        "string.empty": "Invalid Name",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email Required",
        "string.email":"Invalid Email"
    }),
    phoneNo:Joi.string().pattern(new RegExp(/^[0-9]+$/)).label("phoneNo").min(11).max(11).required().messages({
        "string.min": "Phone Number,Max (11) Numbers Required",
        "any.required": "Phone Number Required",
        'string.pattern.base': '{#label} must be in number',
        'string.base': '{#label} should be a type of "number"',
        // "s.pattern":"Phone Must be ENter in numbers"
    }),
    password: Joi.string().min(8).required().messages({
        "any.required": "Password Minumum 8 Character Required",
        "string.email":"Password Required"
    }),
    confirmPassword: Joi.valid(Joi.ref("password")).required().messages({
        'any.only': "Passwords didn't Match",
        "any.required": "Invalid Confirm Password"
    })
}).required().messages({
    "any.required":"Invalid User Data"
})

//login Valiation
const loginValidationOwner= Joi.object({
    email:Joi.string().required().email().messages({
        "any.required": "Email Required",
        "string.email":"Invalid Email"
    }),
    password:Joi.string().min(8).required().messages({
        "string.min": "Password, Minimum (8) Chracters Required",
        "any.required": "Password Required"
    }),
}).required().messages({
    "any.required": "Invalid User Login Data"
})

const emailValidationOwner=Joi.object({
    email:Joi.string().required().email().messages({
        "any.required": "Email Required",
        "string.email":"Invalid Email"
    }),
}).required().messages({
    "any.required": "Invalid Email Validation Data"
})

//Verification Code Validation
const emailVerificationOwner=Joi.object({
    email:Joi.string().required().email().messages({
        "any.required": "Email Required",
        "string.email":"Invalid Email"
    }),
    verificationCode:Joi.string().required().messages({
        "any.required": "Verification Code Required",
        "string.min": "Verification Code, Minimum (5) Chracters Required",
        "string.max": "Verification Code, Maximum (5) Chracters Required",
    }),
}).required().messages({
    "any.required": "Invalid Code Verification Data"
})

const resetOwnerPasswordValidation = Joi.object({
    // _id:Joi.string().required().messages({
    //     "any.required": "Id Required",
    // }),
    email:Joi.string().required().email().messages({
        "any.required": "Email Required",
        "string.email":"Invalid Email"
    }),
    password:Joi.string().min(8).required().messages({
        "string.min": "Password, Minimum (8) Chracters Required",
        "any.required": "Password Required"
    }),
    confirmPassword: Joi.valid( Joi.ref( "password" ) ).required().messages({
        'any.only': "Passwords didn't Match",
        "any.required": "Invalid Confirm Password"
    }),
}).required().messages({
    "any.required": "Invalid Password Validation"
})
// const resetPasswordValidationOwner = Joi.object({
//     // _id:Joi.string().required().messages({
//     //     "any.required": "Id Required",
//     // }),
//     email:Joi.string().required().email().messages({
//         "any.required": "Email Required",
//         "string.email":"Invalid Email"
//     }),
//     password:Joi.string().min(8).required().messages({
//         "string.min": "Password, Minimum (8) Chracters Required",
//         "any.required": "Password Required"
//     }),
//     confirmPassword: Joi.valid( Joi.ref( "password" ) ).required().messages({
//         'any.only': "Passwords didn't Match",
//         "any.required": "Invalid Confirm Password"
//     }),
// }).required().messages({
//     "any.required": "Invalid Password Validation"
// })
// edit profile
const profileValidationOwner = Joi.object({
    _id:Joi.string().required().messages({
        "any.required": "Id Required",
    }),
    name: Joi.string().pattern(new RegExp(/^[a-zA-Z\s]*$/)).label("name").required().messages({
        "any.required": " Name Required",
        "string.empty": "Invalid Name",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
    email: Joi.string().required().messages({
        "any.required": "Last Name Required",
        "string.empty": "Invalid Last Name",
    }),
  
}).required().messages({
    "any.required": "Invalid Profile Data"
})
const changePasswordOwner= Joi.object({
    _id:Joi.string().required().messages({
        "any.required": "Id Required",
    }),
    oldPassword:Joi.string().min(8).required().messages({
        "string.min": "Password, Minimum (8) Chracters Required",
        "any.required": "Password Required"
    }),
    password:Joi.string().min(8).required().messages({
        "string.min": "Password, Minimum (8) Chracters Required",
        "any.required": "Password Required"
    }),
    confirmPassword: Joi.valid(Joi.ref("password")).required().messages({
        'any.only': "Passwords didn't Match",
        "any.required": "Invalid Confirm Password"
    })
}).required().messages({
    "any.required": "Invalid password Data"
})    
module.exports = {
    signUpValidationOwner,
    loginValidationOwner,
    emailValidationOwner,
    emailVerificationOwner,
    resetOwnerPasswordValidation,
    profileValidationOwner,
    changePasswordOwner
}