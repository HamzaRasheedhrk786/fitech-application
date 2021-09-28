const Router = require("express").Router();
const {User,Owner, Subscription}=require('../../Models');
const bcrypt=require('bcryptjs');
const nodemailer = require('nodemailer');
const rn=require('random-number');
// const fetch=require('node-fetch');
// const {OAuth2Client}=require('google-auth-library');
const { signUpValidation, loginValidation, emailValidation, emailVerification, resetPasswordValidation, profileValidation,changePassword }=require('../../Validation/userValidator');
const {SOCIAL, LOCAL}=require("../constVariables");

// const  client=new OAuth2Client("663357206943-37kejls5uce3mfp6mnars657j7dr8iu3.apps.googleusercontent.com");
    // getting total number of users
Router.get("/records",(req,res)=>{
    User.find().count().then(foundUser=>
        {

            console.log(foundUser)
            //  console.log("sdsdf",foundUser*1234)
             if(foundUser)
             {
                return res.json({message:"Users Found",users:foundUser,success:true}).status(200)
             }
             else
             {
                 
                return res.json({error:{message:"User Not Exists",errorCode:500},success:false}).status(400)
             }
            
        }).catch(err=>
            {
                console.log(err)
                return res.json({ error: {  message: "Catch Error,User Not Found", errorCode : 500} , success: false}).status( 500 );
            })
})
// server response
    Router.get("/",(req,res)=>{
        User.find().then(findUser=>
            {
                // console.log(findUser*1234)
                if(findUser)
                {
                    return res.json({message:"Users Found",users:findUser,success:true}).status(200)
                }
                else
                {
                    
                    return res.json({error:{message:"User Not Exists",errorCode:500},success:false}).status(400)
                }
            }).catch(err=>
                {
                    return res.json({error:{message:"Catch Error, User Not Exists",errorCode:500},success:false}).status(400)
                })
        // return res.json({message:"useer serrver runing",success:"true"}).status(200);
    }) 
// sign up user
Router.post("/signup",(req, res)=>{   
    const { user } = req.body;
    //validation`
    // console.log("Api SignUp Input");
    // console.log(req.body);
    signUpValidation.validateAsync( user )
    .then( validated => {
        User.findOne({email:user.email})
        .then(newUser=>{
                // 1.1) if exist return response as Email Already Exist else next step
                if(newUser!==null){
                    return res.json({error:{message:"Email Already Registerd In System ", errorCode: 500}, success:false}).status(500); 
                }
                Owner.findOne({email:user.email}).then(newOwner=>{
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
                            bcrypt.hash(user.password, salt, ( err, hash ) =>{
                                if( err ){
                                    return res.json({error:{message:"Password not Hashed", errorCode:500}, success:false}).status(500);
                                }else{
                                    // 2.2) prepare NewUserObject ANd Save IT
                                    User.findOne().sort({_id:-1}).limit(1).then(userFound=>{
                                        console.log(userFound)
                                        if(userFound!==null){

                                            let sId = userFound.userID;
                                            console.log(userFound.userID)
                                            let getPart = sId.replace( /[^\d.]/g, '' ); // returns 001
                                            console.log(getPart)
                                            let num = parseInt(getPart); // returns 1
                                            console.log(num)
                                            let newVal = num+1; // returns 2
                                            console.log(newVal)
                                            let reg = new RegExp(num); // create dynamic regexp
                                            user.userID= sId.replace( reg, newVal ); // returns T-002
                                            console.log(user.userID)
                                        
                                        const newUser = new User({
                                            firstName:user.firstName,
                                            lastName:user.lastName,
                                            email:user.email,
                                            password:hash,
                                            userID:user.userID,
                                            phoneNumber:user.phoneNumber,
                                            address:user.address,
                                            image:user.image,
                                        }) 
                                        newUser.save().then(savedUser=>{
                                            if(savedUser){
                                                let newCreatedUser = {
                                                    _id : savedUser._id,
                                                    firstName : savedUser.firstName,
                                                    lastName : savedUser.lastName,
                                                    email : savedUser.email,
                                                    phoneNumber: savedUser.phoneNumber,
                                                    address : savedUser.address,
                                                    image:savedUser.image
                                                }
                                            //    let createdUser = delete  savedUser.password;
                                            return  res.json({message:"SignUp Successfully", user: newCreatedUser, success:true}).status(200);
                                            }
                                            else{
                                                return res.json({error:{message:"SignUp Failed", errorCode: 500}, success:false}).status(500)
                                            }
                                        }).catch(err=>{
                                           return res.json({error:{message:"SignUp Failed",err, errorCode: 500}, success:false}).status(500)
                                        })
                                    }
                                    else
                                    {
                                        const newUser = new User({
                                            firstName:user.firstName,
                                            lastName:user.lastName,
                                            email:user.email,
                                            password:hash,
                                            phoneNumber:user.phoneNumber,
                                            address:user.address,
                                            image:user.image,
                                        }) 
                                        newUser.save().then(savedUser=>{
                                            if(savedUser){
                                                let newCreatedUser = {
                                                    _id : savedUser._id,
                                                    firstName : savedUser.firstName,
                                                    lastName : savedUser.lastName,
                                                    email : savedUser.email,
                                                    phoneNumber: savedUser.phoneNumber,
                                                    address : savedUser.address,
                                                    image:savedUser.image
                                                }
                                            //    let createdUser = delete  savedUser.password;
                                            return  res.json({message:"SignUp Successfully", user: newCreatedUser, success:true}).status(200);
                                            }
                                            else{
                                                return res.json({error:{message:"SignUp Failed", errorCode: 500}, success:false}).status(500)
                                            }
                                        }).catch(err=>{
                                           return res.json({error:{message:"SignUp Failed",err, errorCode: 500}, success:false}).status(500)
                                        })

                                    }
                                    })
                                   
                                }
                            } )
                        }   
                    })
                }
            }).catch(err=>{
                return res.json({error:{message:"Catch Error While Finding Email In Owner",errorCode:500},success:false}).status(400);
            })   
        })
    })
    .catch( err => {
        if( err.isJoi === true ){
            return res.json({ error: { message: err.message , errorCode: 500} , success: false});
        }else{
            return res.json({ error: {  message: "Catch Error, User SignUp", errorCode : 500} , success: false}).status( 500 );
        }
    } )
})

// login user 
Router.post("/login", (req, res) =>{
    const { user } = req.body;
    
    loginValidation.validateAsync(user)
    .then(loginValidated=>{
        User.findOne({email:user.email}).then(loginUser=>{
            if(!loginUser){
                return res.json({error:{message:"Email Not Registed ", errorCode: 500}, success:false}).status(500); 
            }
            else{
                bcrypt.compare(user.password, loginUser.password).then(result=>{
                    if(result){
                        return res.json({message:"Login Success", user:loginUser, success:true}).status(200);
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
    })
    .catch(err=>{
        if( err.isJoi === true ){
            return res.json({ error: { message: err.message , errorCode: 500} , success: false});
        }else{
            return res.json({ error: {  message: "Catch Error,User Login", errorCode : 500} , success: false}).status( 500 );
        }
    })
})

//Sent Email and Code
Router.post("/forgotPassword", (req,res)=>{
    const {user}=req.body;
    
    emailValidation.validateAsync(user)
    .then(emailValidate=>{
        User.findOne({email:user.email}).then(userEmail=>{
                if(!userEmail){
                    return res.json({error:{message:"Email Not Registered", errorCode: 500}, success:false}).status(500); 
                }
                else{
                    let transporter = nodemailer.createTransport({
                        service:"gmail",
                        host: "smtp.gmail.com",
                        auth: {
                          user: 'pifitorfit@gmail.com', // generated ethereal user
                          pass: 'WEAREnumber1@', // generated ethereal password
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
                        to: user.email, //pifitor@gmail.com // list of receivers
                        subject: "Pifitor Verifcation Code", // Subject line
                        text: RandomNumber.toString(), // Random Number Generator 
                    };
                    console.log("mailOptions",mailOptions)
                    //send Mail                      
                    transporter.sendMail(mailOptions,(err,data) => {
                        if(err){
                            console.log(err);
                            return res.json({error:{message:"Unable To Sent Mail", success:false}}).status(500);
                        }
                        else{
                            // return res.json({message:`email sent to ${mailOptions.to}`,success:true}).status(200);
                            User.updateOne({email:user.email}, {$set: { verificationCode: mailOptions.text, emailVerify:false }})
                                .then(userCode=>{
                                    if(userCode){
                                        User.findOne({email:user.email})
                                            .then(foundUser=>{
                                                if(!foundUser){
                                                    return res.json({error:{message:"User Not Found", success:false}}).status(500);
                                                }else{
                                                    return  res.json({message:"Please check your email for verifcation code", user:foundUser,success:true}).status(200);
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
    const { user } = req.body;
    emailVerification.validateAsync(user)
    .then(emailValidated=>{
        User.findOne({email:user.email})
        .then(emailUser=>{
            if(!emailUser){
                return res.json({error:{message:"Email Not Registered ", errorCode: 500}, success:false}).status(500); 
            }
            else{
                    // console.log("emailUser,",emailUser)
                if(emailUser.verificationCode===user.verificationCode){
                    const options={
                        min:100000,
                        max:999999,
                        integer: true
                    }
                    const RandomNumber=rn(options);
                    User.updateOne({email:emailUser.email},  {$set: { emailVerify: true }, verificationCode:RandomNumber })
                    .then(codeResult=>{
                        if(codeResult){
                            User.findOne({email:user.email})
                            .then(foundUser=>{
                                if(!foundUser){
                                    return res.json({error:{message:"User Not Found", success:false}}).status(500);
                                }else{
                                    return res.json({message:"Verification Code Matched",user:foundUser, success:true}).status(200); 
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
//resetPassword
Router.patch("/resetPassword", (req, res)=>{
    const {user}=req.body;
    
    resetPasswordValidation.validateAsync(user)
        .then(passwordValidated=>{
            User.findOne({email:user.email})
            .then(userEmail=>{
                if(!userEmail){
                    return res.json({error:{message:"User Not Exists", errorCode:500}, success:false}).status(500);
                }
                else{
                    bcrypt.genSalt(10, (err, salt)=>{
                        if(err){
                            return res.json({error:{message:"Password not Salt", errorCode:500}, success:false}).status(500);
                        }
                        else{
                            bcrypt.hash(user.password, salt, ( err, hash ) =>{
                                if(err){
                                    return res.json({error:{message:"Password not Hashed", errorCode:500}, success:false}).status(500); 
                                }else{
                                    const newUser={
                                        email:user.email,
                                        password:hash,
                                    }
                                    User.updateOne({email:user.email}, {$set: { password:newUser.password}})
                                        .then(updateUser=>{
                                            if(updateUser){
                                                User.findOne({email:user.email})
                                                .then(foundUser=>{
                                                    if(!foundUser){
                                                        return res.json({error:{message:"User Not Found", success:false}}).status(500);
                                                    }else{
                                                        return res.json({message:"Password Updated", user:foundUser, success:true}).status(200)
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
                return res.json({ error: {  message: "Catch Error,Forgot Passswor", errorCode : 500} , success: false}).status( 500 );
            }
        })
})
//Get all user and by id
Router.get("/:_id?", (req, res) =>{
    const { _id } = req.params;
    if( _id === "ALL" ){
        User.find({  })
        .then( allUser => {
            return res.json({ message: "All User found", user:allUser, success:true}).status(200);
        } )
        .catch( err => {
            return res.json({ error:{message:"No User Exist", errorCode:500}, success:false }).status(500);
        } )
    }else if(_id===_id){
        User.findOne({ _id: _id })
        .then( oneUser => {
            let newCreatedUser = {
                createdAt : oneUser.createdAt,
                _id : oneUser._id,
                firstName : oneUser.firstName,
                email : oneUser.email,
                phoneNumber: oneUser.phoneNumber,   
                address : oneUser.address,
                emailVerify: oneUser.emailVerify,
                verificationCode: oneUser.verificationCode,
                image:oneUser.image
            }
            return res.json({ message: "Single User Found", users: newCreatedUser, success:true}).status(200);
        } )
        .catch( err => {
            return res.json({ error:{message:"Single User Not Exists",err, errorCode:500},success:false }).status(500);
        } )
    }
    else{
        return res.json({error:{message:"No User Found", errorCode:500}, success:false}).status(500);
    }
} )


// updating user data
Router.patch('/profileUpdate',(req, res)=>{
    const {user}=req.body;    
    console.log("Profile Update Input");
    console.log(req.body);
    profileValidation.validateAsync(user)
        .then(profileValidatd=>{
            User.findOne({_id:user._id})
                .then(userFind=>{
                    if(!userFind){
                        return res.json({error:{message:"User Not Exists", errorCode:500}, success:false}).status(500);
                    }
                    // User.findOne({email:userId.email}).then(emailFound=>
                    //     {
                    //         if(emailFound)
                    //         {
                    //             return res.json({error:{message:"User Email Already Exist", errorCode:500}, success:false}).status(500);
                    //         }
                            else{
                                // let sId = userFind.userID;
                                // let getPart = sId.replace ( /[^\d.]/g, '' ); // returns 001
                                // let num = parseInt(getPart); // returns 1
                                // let newVal = num+1; // returns 2
                                // let reg = new RegExp(num); // create dynamic regexp
                                // user.userID = sId.replace ( reg, newVal );
                                User.updateOne({_id:user._id}, {$set:{firstName:user.firstName,lastName:user.lastName,email:user.email,phoneNumber:user.phoneNumber, address:user.address,dateOfBirth:user.dateOfBirth,country:user.country,city:user.city,province:user.province,houseNo:user.houseNo,streetName:user.streetName}})
                                .then(updateProfile=>{
                                    if(updateProfile){
                                        User.findOne({ _id: user._id })
                                        .then( foundUser => {
                                            return res.json({ msg: "User Found and Profile Update",  user: foundUser, success: true })
                                        } )
                                        .catch( err => {
                                            return res.json({ error: { message: "Catch Error, Getting User", errorCode: 500 }, success: false })
                                            .status( 500 );
                                        } )
                                        // return res.json({message:"Profile Updated", success:true}).status(200)
                                    }
                                    else{
                                        return res.json({error:{message:"Profile not Updated", errorCode:500}, success:false}).status(500); 
                                    }
                                }).catch(err=>{
                                    return res.json({error:{message:err.message, errorCode:500},success:false}).status(500);
                                })
                            }
                        // })
                    
                })
        }).catch(err=>{
            if( err.isJoi === true ){
                return res.json({ error: { message: err.message , errorCode: 500} , success: false});
            }else{
                return res.json({ error: {  message: "Catch Error,Profile Update", errorCode : 500} , success: false}).status( 500 );
            }
        })
})
// change password
Router.put("/changePassword",(req,res)=>
{
    const {user} = req.body;
    changePassword.validateAsync(user).then(validated=>
        {
            if(validated){
             // finding user against id
            User.findOne({_id:user._id}).then(userFound=>{
            if(!userFound)
            {
                console.log(userFound)
             return res.json({error:{messsage:"User Not Exist Against Id"},success:false}).status(400)
            }
            bcrypt.compare(user.oldPassword, userFound.password).then(result=>{
                if(result){
                    console.log(result)
                    // return res.json({message:"password matched", success:true}).status(200);
                    bcrypt.genSalt(10, (err, salt)=>{
                        if(err){
                            return res.json({error:{message:"Password not Salt", errorCode:500}, success:false}).status(500);
                        }
                        else{
                            bcrypt.hash(user.password, salt, ( err, hash ) =>{
                                if(err){
                                    return res.json({error:{message:"Password not Hashed", errorCode:500}, success:false}).status(500); 
                                }else{
                                    const newUser={
                                        password:hash,
                                    }
                                    User.updateOne({_id:user._id}, {$set: { password:newUser.password}})
                                        .then(updateUser=>{
                                            if(updateUser){
                                                User.findOne({_id:user._id})
                                                .then(foundUser=>{
                                                    if(!foundUser){
                                                        return res.json({error:{message:"User Not Found", success:false}}).status(500);
                                                    }else{
                                                        return res.json({message:"Password Updated", user:foundUser, success:true}).status(200)
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
                else{
                    return res.json({error:{message:"Please Enter Correct Password", errorCode:500}, success:false}).status(500);
                }
            })
        })
    }
    }).catch(err =>{
        if( err.isJoi === true ){
            return res.json({ error: { message: err.message , errorCode: 500} , success: false});
        }else{
            return res.json({ error: {  message: "Catch Error,change Passsword", errorCode : 500} , success: false}).status( 500 );
        }
    })

})

module.exports = Router;

