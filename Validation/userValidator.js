// joi validations for schema validation
const Joi= require('joi')
const {ref} = require('joi')
// input fields varification
const signUpValidation = Joi.object({
    firstName: Joi.string().pattern(new RegExp(/^[a-zA-Z]+$/)).label("firstName").required().messages({
        "any.required": "First Name Required",
        "string.empty": "Invalid First Name",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
    lastName: Joi.string().pattern(new RegExp(/^[a-zA-Z]+$/)).label("lastName").required().messages({
        "any.required": "Last Name Required",
        "string.empty": "Invalid Last Name",
        'string.pattern.base': '{#label} must be in aiphabets'
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email Required",
        "string.email":"Invalid Email"
    }),
    password: Joi.string().min(8).required().messages({
        "any.required": "Password Minumum 8 Character Required",
        "string.email":"Password Required"
    }),
    confirmPassword: Joi.valid(Joi.ref("password")).required().messages({
        'any.only': "Passwords didn't Match",
        "any.required": "Invalid Confirm Password"
    }),
    phoneNumber:Joi.string().pattern(new RegExp(/^[0-9]+$/)).label("phoneNumber").min(11).max(11).required().messages({
        "string.min": "Phone Number,Max (11) Numbers Required",
        "any.required": "Phone Number Required",
        'string.pattern.base': '{#label} must be in number',
        'string.base': '{#label} should be a type of "number"',
        // "s.pattern":"Phone Must be ENter in numbers"
    }),
    address:Joi.string().required().messages({
        "any.required": "Address Required",
        "string.empty": "Invalid Address"
    })
}).required().messages({
    "any.required":"Invalid User Data"
})

//login Valiation
const loginValidation= Joi.object({
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

const emailValidation=Joi.object({
    email:Joi.string().required().email().messages({
        "any.required": "Email Required",
        "string.email":"Invalid Email"
    }),
}).required().messages({
    "any.required": "Invalid Email Validation Data"
})

//Verification Code Validation
const emailVerification=Joi.object({
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

const resetPasswordValidation = Joi.object({
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
// edit profile
const profileValidation = Joi.object({
    _id:Joi.string().required().messages({
        "any.required": "Id Required",
    }),
    firstName: Joi.string().pattern(new RegExp(/^[a-zA-Z]+$/)).label("firstName").required().messages({
        "any.required": "First Name Required",
        "string.empty": "Invalid First Name",
        'string.pattern.base': '{#label} must be in alphabets',
    }),
    lastName: Joi.string().pattern(new RegExp(/^[a-zA-Z]+$/)).label("lastName").required().messages({
        "any.required": "Last Name Required",
        "string.empty": "Invalid Last Name",
        'string.pattern.base': '{#label} must be in number',
    }),
    email:Joi.string().required().email().messages({
        "any.required": "Email Required",
        "string.email":"Invalid Email"
    }),
    phoneNumber:Joi.string().pattern(new RegExp(/^[0-9]+$/)).label("phoneNumber").min(11).max(11).required().messages({
        "string.min": "Phone Number,Max (11) Numbers Required",
        "any.required": "Phone Number Required",
        'string.pattern.base': '{#label} must be in number',
        'string.base': '{#label} should be a type of "number"',
        // "s.pattern":"Phone Must be ENter in numbers"
    }),
    address:Joi.string().required().messages({
        "any.required": "Address Required",
        "string.empty": "Invalid Address"
    }),
    dateOfBirth:Joi.date().required().messages({
        "any.required": "Date Of Birth Required",
        "string.empty": "Invalid Date Of Birth"
    }),
    country:Joi.string().required().messages({
        "any.required": "Country Required",
        "string.empty": "Invalid country"
    }),
    city:Joi.string().required().messages({
        "any.required": "city Required",
        "string.empty": "Invalid city"
    }),
    province:Joi.string().required().messages({
        "any.required": "Country Required",
        "string.empty": "Invalid country"
    }),
    houseNo:Joi.string().required().messages({
        "any.required": "House No Required",
        "string.empty": "Invalid House No"
    }),
    streetName:Joi.string().required().messages({
        "any.required": "Street Name Required",
        "string.empty": "Invalid Street Nmae"
    }),
    
    

}).required().messages({
    "any.required": "Invalid Profile Data"
})
const changePassword= Joi.object({
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
    confirmPassword: Joi.valid( Joi.ref( "password" ) ).required().messages({
        'any.only': "Passwords didn't Match",
        "any.required": "Invalid Confirm Password"
    }),
}).required().messages({
    "any.required": "Invalid password Data"
})    
module.exports = {
    signUpValidation,
    loginValidation,
    emailValidation,
    emailVerification,
    resetPasswordValidation,
    profileValidation,
    changePassword
}