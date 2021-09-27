const Router = require("express").Router();
// Acuiring owner schema
const {Owner,User}=require('../../Models');
const bcrypt=require('bcryptjs');
const nodemailer = require('nodemailer');
const rn=require('random-number');
// const fetch=require('node-fetch');
// const {OAuth2Client}=require('google-auth-library');
const { signUpValidationOwner, loginValidationOwner, emailValidationOwner,emailVerificationOwner,resetOwnerPasswordValidation}=require('../../Validation/ownerValidator');
const {SOCIAL, LOCAL}=require("../constVariables");


// sign up user
Router.post("/signup",(req, res)=>{   
    const { owner } = req.body;
    //validation`
    // console.log("Api SignUp Input");
    // console.log(req.body);
    signUpValidationOwner.validateAsync( owner )
    .then( validated => {
        if(validated)
        {
            Owner.findOne({email:owner.email})
            .then(newUser=>{
                    // 1.1) if exist return response as Email Already Exist else next step
                    if(newUser!==null){
                        return res.json({error:{message:"Email Already Registerd System", errorCode: 500}, success:false}).status(500); 
                    }
                    User.findOne({email:owner.email}).then(newOwner=>{
                        if(newOwner!==null){
                            return res.json({error:{message:"Email Already Registerd In System ", errorCode: 500}, success:false}).status(500); 
                        }
                        else{
                            //salt passsword
                            bcrypt.genSalt(10, (err, salt)=>{
                                if(err){
                                    return res.json({error:{message:"Password not Salt", errorCode:500}, success:false}).status(500);
                                }
                                else{
                                    bcrypt.hash(owner.password, salt, ( err, hash ) =>{
                                        if( err ){
                                            return res.json({error:{message:"Password not Hashed", errorCode:500}, success:false}).status(500);
                                        }else{
                                            // 2.2) prepare NewUserObject ANd Save IT
                                            const newOwner = new Owner({
                                                name:owner.name,
                                                email:owner.email,
                                                phoneNo:owner.phoneNo,
                                                password:hash,
                                                
                                            }) 
                                            newOwner.save().then(savedOwner=>{
                                                if(savedOwner){
                                                    let newCreatedOwner = {
                                                        _id : savedOwner._id,
                                                        name : savedOwner.name,
                                                        email : savedOwner.email,
                                                        phoneNo:savedOwner.phoneNo,
                                                    }
                                                //    let createdUser = delete  savedUser.password;
                                                return  res.json({message:"SignUp Successfully", owner: newCreatedOwner, success:true}).status(200);
                                                }
                                                else{
                                                    return res.json({error:{message:"SignUp Failed", errorCode: 500}, success:false}).status(500)
                                                }
                                            }).catch(err=>{
                                               return res.json({error:{message:"SignUp Failed",err, errorCode: 500}, success:false}).status(500)
                                            })
                                        }
                                    } )
                                }   
                            })
                        }
    
                    }).catch(err=>{
                        return res.json({error:{message:"Catch Error While Finding Email In User",errorCode:500},success:false}).status(400);
                    })
                    
            })
        }
        else
        {
            return res.json({error:{message:"Owner Sign Up validation Error",errorCode:500},success:true}).status(400)
        }
        
    })
    .catch( err => {
        if( err.isJoi === true ){
            return res.json({ error: { message: err.message , errorCode: 500} , success: false});
        }else{
            return res.json({ error: {  message: "Catch Error, Owner SignUp", errorCode : 500} , success: false}).status( 500 );
        }
    })
})
// login user 
Router.post("/login", (req, res) =>{
    const { owner } = req.body;
    
    loginValidationOwner.validateAsync(owner)
    .then(loginValidated=>{
        if(loginValidated){
            Owner.findOne({email:owner.email}).then(loginOwner=>{
                if(!loginOwner){
                    return res.json({error:{message:"Email Not Registed ", errorCode: 500}, success:false}).status(500); 
                }
                else{
                    bcrypt.compare(owner.password, loginOwner.password).then(result=>{
                        if(result){
                            return res.json({message:"Owner Login Success", user:loginOwner, success:true}).status(200);
                        }  
                        else{
                            return res.json({error:{message:"Invalid Password", errorCode:500}, success:false}).status(500);
                        }
                    }).catch(err => {
                            return res.json({error:{message:err.message, errorCode:500}, success:false}).status(500);
                        }
                    )
                }
            })

        }
        else
        {
            return res.json({error:{message:"Owner Login validation Error",errorCode:500},success:true}).status(400)
        }
        
    })
    .catch(err=>{
        if( err.isJoi === true ){
            return res.json({ error: { message: err.message , errorCode: 500} , success: false});
        }else{
            return res.json({ error: {  message: "Catch Error,Owner Login", errorCode : 500} , success: false}).status( 500 );
        }
    })
})
//Sent Email and Code
Router.post("/forgotPassword", (req,res)=>{
    const {owner}=req.body;
    emailValidationOwner.validateAsync(owner)
    .then(emailValidate=>{
        Owner.findOne({email:owner.email}).then(ownerEmail=>{
                if(!ownerEmail){
                    return res.json({error:{message:"Email Not Registered", errorCode: 500}, success:false}).status(500); 
                }
                else{
                    let transporter = nodemailer.createTransport({
                        service:"gmail",
                        host: "smtp.gmail.com",
                        auth: {
                          user:'pifitorfit@gmail.com', // generated ethereal user
                          pass:'WEAREnumber1@', // generated ethereal password
                        },
                    });
                    //Generate Random Number 
                    const options={
                        min:100000,
                        max:999999,
                        integer: true
                    }
                    const RandomNumber=rn(options);
                    // send mail with defined transport object
                    const mailOptions={
                        from: '"Pifitor" <noreply@pifitor.com>', // sender address
                        to: owner.email, //pifitor@gmail.com // list of receivers
                        subject: "Pifitor Verifcation Code", // Subject line
                        text: RandomNumber.toString(), // Random Number Generator 
                    };
                    console.log("mailOptions",mailOptions)
                    //send Mail                      
                    transporter.sendMail(mailOptions,(err,data) => {
                        if(err){
                            console.log(err);
                            return res.json({error:{message:"Unable To Sent Mail", errorCode:500},success:false}).status(400);
                        }
                        else{
                            // return res.json({message:`email sent to ${mailOptions.to}`,success:true}).status(200);
                            Owner.updateOne({email:owner.email}, {$set: { verificationCode: mailOptions.text, emailVerify:false }})
                                .then(ownerCode=>{
                                    if(ownerCode){
                                        Owner.findOne({email:owner.email})
                                            .then(foundOwner=>{
                                                if(!foundOwner){
                                                    return res.json({error:{message:"User Not Found", success:false}}).status(500);
                                                }else{
                                                    return  res.json({message:"Please check your email for verifcation code", owner:foundOwner,success:true}).status(200);
                                                }
                                            })
                                    }
                                    else{
                                        //userCode Not Found
                                        return res.json({error:{message:"Verification Code Not Added", success:false}}).status(500);
                                    }
                                }).catch(err=>{
                                    if(err){
                                        return res.json({error:{message:err.message, errorCode:500}, success:false});
                                    }
                                    else{
                                        return res.json({error:{message:"Catch Errro, Verifaction Code", errorCode:5000},success:false}).status(500);
                                    }
                                })
                            
                        }
                    });                    
                }
            })
    }).catch(err=>{
        if(err.isJoi===true){
            return res.json({error:{message:err.message, errorCode:500}, success:false});
        }
        else{
            return res.json({error:{message:"Catch Error,Sent Mail Validation", errorCode:5000}, success:false}).status(500);
        }
    })
})

//Code Verify Matched or Not
Router.post("/codeVerification", (req, res) =>{
    const { owner } = req.body;
    emailVerificationOwner.validateAsync(owner)
    .then(emailValidated=>{
        Owner.findOne({email:owner.email})
        .then(emailOwner=>{
            if(!emailOwner){
                return res.json({error:{message:"Email Not Registered ", errorCode: 500}, success:false}).status(500); 
            }
            else{
                    // console.log("emailUser,",emailUser)
                if(emailOwner.verificationCode===owner.verificationCode){
                    const options={
                        min:100000,
                        max:999999,
                        integer: true
                    }
                    const RandomNumber=rn(options);
                    Owner.updateOne({email:emailOwner.email},  {$set: { emailVerify: true }, verificationCode:RandomNumber })
                    .then(codeResult=>{
                        if(codeResult){
                            Owner.findOne({email:owner.email})
                            .then(foundOwner=>{
                                if(!foundOwner){
                                    return res.json({error:{message:"Owner Not Found", success:false}}).status(500);
                                }else{
                                    return res.json({message:"Verification Code Matched",owner:foundOwner, success:true}).status(200); 
                                }
                            })
                        }
                        else{
                            return res.json({error:{message:"Verification Code Not Matched", errorCode:500}, success:false}).status(500);
                        }
                    }).catch(err=>{
                        return res.json({error:{message:err.message, errorCode:500}, success:false}).status(500);
                    })
                }
                else{
                    return res.json({error:{message:"Invalid Verification Code", errorCode:500}, success:false}).status(500);
                }
            }
        })
    })
    .catch(err=>{
        if( err.isJoi === true ){
            return res.json({ error: { message: err.message , errorCode: 500} , success: false});
        }else{
            return res.json({ error: {  message: "Catch Error,Code Verfication", errorCode : 500} , success: false}).status( 500 );
        }
    })
} )
// reset password
Router.patch("/resetPassword", (req, res)=>{
    const {owner}=req.body;
    
    resetOwnerPasswordValidation.validateAsync(owner)
        .then(passwordValidated=>{
            Owner.findOne({email:owner.email})
            .then(ownerEmail=>{
                if(!ownerEmail){
                    return res.json({error:{message:"owner Not Exists", errorCode:500}, success:false}).status(500);
                }
                else{
                    bcrypt.genSalt(10, (err, salt)=>{
                        if(err){
                            return res.json({error:{message:"Password not Salt", errorCode:500}, success:false}).status(500);
                        }
                        else{
                            bcrypt.hash(owner.password, salt, ( err, hash ) =>{
                                if(err){
                                    return res.json({error:{message:"Password not Hashed", errorCode:500}, success:false}).status(500); 
                                }else{
                                    const newOwner={
                                        email:owner.email,
                                        password:hash,
                                    }
                                    Owner.updateOne({email:owner.email}, {$set: { password:newOwner.password}})
                                        .then(updateUser=>{
                                            if(updateUser){
                                                Owner.findOne({email:owner.email})
                                                .then(foundUser=>{
                                                    if(!foundUser){
                                                        return res.json({error:{message:"Owner Not Found", success:false}}).status(500);
                                                    }else{
                                                        return res.json({message:"Password Updated", owner:foundUser, success:true}).status(200)
                                                    }
                                                })
                                            }
                                            else{
                                                return res.json({error:{message:"Password not Updated", errorCode:500}, success:false}).status(500); 
                                            }
                                        }).catch(err=>{
                                            return res.json({error:{message:err.message, errorCode:500},success:false}).status(500);
                                        })
                                }
                            })
                        }
                    })
                }
            })
        }).catch(err=>{
            if( err.isJoi === true ){
                return res.json({ error: { message: err.message , errorCode: 500} , success: false});
            }else{
                console.log(err)
                return res.json({ error: {  message: "Catch Error,Forgot Passsword", errorCode : 500} , success: false}).status( 500 );
            }
        })
})
// change password
// change password
// Router.put("/changePassword",(req,res)=>
// {
//     const {owner} = req.body;
//     changePasswordOwner.validateAsync(owner).then(validated=>
//         {
//             if(validated){
//              // finding user against id
//             Owner.findOne({_id:owner._id}).then(ownerFound=>{
//             if(!ownerFound)
//             {
//                 console.log(ownerFound)
//              return res.json({error:{messsage:"User Not Exist Against Id"},success:false}).status(400)
//             }
//             bcrypt.compare(owner.oldPassword, ownerFound.password).then(result=>{
//                 if(result){
//                     console.log(result)
//                     // return res.json({message:"password matched", success:true}).status(200);
//                     bcrypt.genSalt(10, (err, salt)=>{
//                         if(err){
//                             return res.json({error:{message:"Password not Salt", errorCode:500}, success:false}).status(500);
//                         }
//                         else{
//                             bcrypt.hash(owner.password, salt, ( err, hash ) =>{
//                                 if(err){
//                                     return res.json({error:{message:"Password not Hashed", errorCode:500}, success:false}).status(500); 
//                                 }else{
//                                     const newOwner={
//                                         password:hash,
//                                     }
//                                     Owner.updateOne({_id:owner._id}, {$set: { password:newOwner.password}})
//                                         .then(updateOwner=>{
//                                             if(updateOwner){
//                                                 Owner.findOne({_id:owner._id})
//                                                 .then(foundOwner=>{
//                                                     if(!foundOwner){
//                                                         return res.json({error:{message:"Owner Not Found", success:false}}).status(500);
//                                                     }else{
//                                                         return res.json({message:"Password Updated", owner:foundOwner, success:true}).status(200)
//                                                     }
//                                                 })
//                                             }
//                                             else{
//                                                 return res.json({error:{message:"Password not Updated", errorCode:500}, success:false}).status(500); 
//                                             }
//                                         }).catch(err=>{
//                                             return res.json({error:{message:err.message, errorCode:500},success:false}).status(500);
//                                         })
//                                 }
//                             })
//                         }
//                     })
//                 }  
//                 else{
//                     return res.json({error:{message:"Please Enter Correct Password", errorCode:500}, success:false}).status(500);
//                 }
//             })
//         })
//     }
   
//     }).catch(err =>{
//         if( err.isJoi === true ){
//             return res.json({ error: { message: err.message , errorCode: 500} , success: false});
//         }else{
//             return res.json({ error: {  message: "Catch Error,change Passsword", errorCode : 500} , success: false}).status( 500 );
//         }
//     })

// })

module.exports = Router;