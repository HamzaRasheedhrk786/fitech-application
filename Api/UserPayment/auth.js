const Router=require("express").Router();
// require subscription model
const {UserPayment,Subscription,User}=require("../../Models");
// const { $where } = require("../../Models/User");
// require joi validation of model
const {paymentValidationUser}= require("../../Validation/userPaymentValidator")
// require storage for image
// const {upload} = require("../../storage")();
const myUpload = require("../../Storage/storage").upload;

// creating subscription
Router.post("/addPayment", myUpload.array('uploadUserPaymentImage',1),(req, res)=>{
    let userPayment = JSON.parse(req.body.userPayment);
    // const {event}=req.body;
    console.log("Add userPayment Input");
    console.log(userPayment);
    console.log(req.files);
    let url = `/image/${req.files[0].filename}`;
    console.log( url );
    // const {event}=req.body;
    paymentValidationUser.validateAsync(userPayment)
        .then(eventValidated=>{
            Subscription.findOne({_id:userPayment.subscriptionId})
                .then(newEvent=>{
                   if(newEvent===null){
                        return res.json({error:{message:"Subscription Not Exists", errorCode:500}, success:false}).status(500);
                   }
                   else{
                       User.findOne({_id:userPayment.userId}).then(newUser=>{
                           if(!newUser)
                           {
                            return res.json({error:{message:"User Not Exists", errorCode:500}, success:false}).status(500);
                           }
                        UserPayment.findOne({userId:userPayment.userId}).then(userExist=>{
                            if(userExist!==null){
                                return res.json({error:{message:"User Already Exists", errorCode:500}, success:false}).status(500);
                            }
                            else{
                                const addPayment=new UserPayment({
                                    subscriptionId:userPayment.subscriptionId,
                                    userId:userPayment.userId,
                                    amount:newEvent.amount,
                                    image:url
                                })     
                                addPayment.save().then(savePay=>{
                                    return  res.json({message:"Payment Added", userPayment: savePay, success:true}).status(200);
                                }).catch(err=>{
                                    return res.json({error:{message:"Payment Not Added",err, errorCode: 500}, success:false}).status(500)
                            })
                          }
                           }).catch(err=>{
                               return res.json({error:{message:"Catch Error While Findind User",errorCode:500},success:false}).status(400);
                           })
                        }).catch(err=>{
                            return res.json({error:{message:"Catch Error While Finding User In Payment",errorCode:500},success:false}).status(400);
                        })   
                           
                   }
                  
            })
        }).catch(err=>{
            if(err.isJoi===true){
                return res.json({error:{message:err.message, errorCode:500},success:false});
            }else{
                return res.json({error:{message:"Catch Error, Subscription Add Error", errorCode:500}, success:false}).status(500);
            }
        })
})
// get payment detail
Router.get("/",(req,res)=>{
    UserPayment.find().populate("userId","email firstName").populate("subscriptionId","name amount").then(allUser=>{
        if(!allUser){
        return res.json({error:{message:"Users Not Found",errorCode:500},success:false}).status(400)
        }
        else
        {
            return res.json({message:"Users Founded",userPayment:allUser,success:true}).status(200)
        }
    })
})
// Single Payment against id
Router.get("/singlepayment",(req,res)=>{
    const {payment}= req.body;
    UserPayment.findOne({_id:payment._id}).populate("userId","email firstName").populate("subscriptionId","name amount").then(findUser=>{
        return res.json({message:"Payment Find Against Id",singlePayment:findUser,success:true}).status(200)
    }).catch(err=>{
        console.log(err)
        return res.json({error:{message:"Catch Error,Payment Not Found Against Id",errorCode:500},success:false}).status(400)
    })

})
// user payment record
Router.get("/singleuser",(req,res)=>{
    const {payment}= req.body;
    UserPayment.findOne({userId:payment.userId}).populate("userId","firstName email").populate("subscriptionId","name amount").then(findUser=>{
        if(findUser){
            return res.json({message:"User Payment Record",userPayment:findUser,success:true}).status(200)
        }
        else
        {
            return res.json({error:{message:"Record Not Found",errorCode:500},success:false}).status(400)  
        }
    }).catch(err=>{
        console.log(err)
        return res.json({error:{message:"Catch Error, While Finding user payment",errorCode:500},success:false}).status(400)
    })
})
// payment againsts subscription
Router.get("/singlesubscriptionpayments",(req,res)=>{
    const {payment}=req.body;
    UserPayment.find({subscriptionId:payment.subscriptionId}).populate("userId","email firstName").populate("subscriptionId","name amount").then(findSub=>
        {
            if(findSub){

                return res.json({message:"All Payments Against the Particular Subscription",Records:findSub,success:true}).status(200)
            }
            else
            {
                return res.json({error:{message:"No Payment Record Found Against Subscription",errorCode:500},success:false}).status(400)  
            }
        }).catch(err=>{
            return res.json({error:{message:"Catch Error, While Finding Subscription payment",errorCode:500},success:false}).status(400)
        })
})

Router.post("/payment", myUpload.array('uploadUserPaymentImage',1),(req, res)=>{
    let userPayment = JSON.parse(req.body.userPayment);
    // const {event}=req.body;
    console.log("Add userPayment Input");
    console.log(userPayment);
    console.log(req.files);
    let url = `/image/${req.files[0].filename}`;
    console.log( url );
    // const {event}=req.body;
    paymentValidationUser.validateAsync(userPayment)
        .then(eventValidated=>{
            Subscription.findOne({_id:userPayment.subscriptionId})
                .then(newEvent=>{
                   if(!newEvent){
                        return res.json({error:{message:"Subscription Not Exists", errorCode:500}, success:false}).status(500);
                   }
                   else
                   {
                       User.findOne({_id:userPayment.userId}).then(userFound=>{
                           if(!userFound)
                           {
                            return res.json({error:{message:"User Not Exist Against Id",errorCode:500},success:false}).status(400)
                           }
                           else
                           {
                               UserPayment.findOne({userId:userPayment.userId}).sort({_id:-1}).limit(1).then(userPay=>{
                                   console.log("users",userPay)
                                   if(userPay!==null && userPay.status==="active")
                                   {
                                    return res.json({error:{message:"User Already Had Active Payment Record",errorCode:500},success:false}).status(400)
                                   }
                                   else if (userPay!==null && userPay.status==="inactive")
                                   {
                                    const addPayment=new UserPayment({
                                        subscriptionId:userPayment.subscriptionId,
                                        userId:userPayment.userId,
                                        amount:newEvent.amount,
                                        image:url
                                    })     
                                    addPayment.save().then(savePay=>{
                                        return  res.json({message:"Payment Added", userPayment: savePay, success:true}).status(200);
                                    }).catch(err=>{
                                        return res.json({error:{message:"Payment Not Added",err, errorCode: 500}, success:false}).status(500)
                                })
                                   }
                                   else if(userPay===null)
                                   {
                                    const addPayment=new UserPayment({
                                        subscriptionId:userPayment.subscriptionId,
                                        userId:userPayment.userId,
                                        amount:newEvent.amount,
                                        image:url
                                    })     
                                    addPayment.save().then(savePay=>{
                                        return  res.json({message:"Payment Added", userPayment: savePay, success:true}).status(200);
                                    }).catch(err=>{
                                        return res.json({error:{message:"Payment Not Added",err, errorCode: 500}, success:false}).status(500)
                                })
                                   }
                               }).catch(err=>{
                                return res.json({error:{message:"Catch Error While Finding User In Payment Table",errorCode:500},success:false}).status(400)
                               })
                           }
                       }).catch(err=>{
                        return res.json({error:{message:"Catch Error While Finding User in User",errorCode:500},success:false}).status(400)
                       })
                   }
                  
            }).catch(err=>{
                return res.json({error:{message:"Catch Error While Finding Subscription in subscription",errorCode:500},success:false}).status(400)
            })
        }).catch(err=>{
            if(err.isJoi===true){
                return res.json({error:{message:err.message, errorCode:500},success:false});
            }else{
                return res.json({error:{message:"Catch Error, Subscription Add Error", errorCode:500}, success:false}).status(500);
            }
        })
})
// get all active payment records
Router.get("/allActiveUser",(req,res)=>{
    UserPayment.find({status:"active"}).populate("userId","firstName image").populate("subscriptionId","name amount image").then(allUser=>{
        if(!allUser)
        {
            return res.json({error:{message:"User Not Found",errorCode:500},success:false}).status(400)
        }
        else
        {
            return res.json({message:"Active Users Founded",activeUsers:allUser,success:true}).status(400)
        }
    }).catch(err=>{
        return res.json({error:{message:"Catch ERRor while finding active User",errorCode:500},success:false}).status(400)
    })
})
// get all active payment records
Router.get("/allInactiveUser",(req,res)=>{
    UserPayment.find({status:"inactive"}).populate("userId","firstName image").populate("subscriptionId","name amount image").then(allUser=>{
        if(!allUser)
        {
            return res.json({error:{message:"User Not Found",errorCode:500},success:false}).status(400)
        }
        else
        {
            return res.json({message:"Active Users Founded",activeUsers:allUser,success:true}).status(400)
        }
    }).catch(err=>{
        return res.json({error:{message:"Catch ERRor while finding active User",errorCode:500},success:false}).status(400)
    })
})
// Get user payment detail currently active
Router.get("/singleUserActive",(req,res)=>{
    const {userPayment}=req.body;
    UserPayment.findOne({userId:userPayment.userId}).sort({_id:-1}).limit(1).then(findUser=>{
        console.log("user",findUser)
        if(findUser && findUser.status==="inactive")
        {
            return res.json({error:{message:"User Status Inactive",errorCode:500},success:false}).status(400)
        }
        else if(findUser && findUser.status==="active")
        {
            return res.json({message:"Current User Active Payment",activePayment:findUser,success:true}).status(200)
        }
        else{
            return res.json({message:"User Not Exist In Payment",activePayment:findUser,success:true}).status(200)
        }
    }).catch(err=>{
        return res.json({error:{message:"Catch ERRor while finding single active User",errorCode:500},success:false}).status(400)
    })
})
// Getting User Joining Date
Router.get("/joinDate",(req,res)=>
{
    const {userPayment} =req.body;
    UserPayment.findOne({userId:userPayment.userId}).sort({_id:-1}).limit(1).then(findUser=>
        {
            console.log("user",findUser)
            if(findUser && findUser.status==="inactive")
            {
                return res.json({error:{message:"User Status Inactive",errorCode:500},success:false}).status(400)
            }
            else if(findUser && findUser.status==="active")
            {
                return res.json({message:"Current User Active Payment Date",activePayment:findUser.paymentDate,success:true}).status(200)
            }
            else{
                return res.json({message:"User Not Exist In Payment",activePayment:findUser,success:true}).status(200)
            }
        }).catch(err=>{
            console.log("err",err)
        return res.json({error:{message:"Catch ERRor while finding single active User Date",errorCode:500},success:false}).status(400)
    })
})
Router.get("/expiryDate",(req,res)=>
{
    const {userPayment} =req.body;
    UserPayment.findOne({userId:userPayment.userId}).sort({_id:-1}).limit(1).then(findUser=>
        {
            console.log("user",findUser)
            if(findUser && findUser.status==="inactive")
            {
                return res.json({error:{message:"User Status Inactive",errorCode:500},success:false}).status(400)
            }
            else if(findUser && findUser.status==="active")
            {
                console.log("join date",findUser.paymentDate) 
                let someDate = new Date(findUser.paymentDate);
                someDate.setDate(someDate.getDate()+30); //number  of days to add, e.x. 15 days
                let dateFormated = someDate;
                console.log("expiryDate",dateFormated);
                return res.json({message:"User Subcription Expiry Date",activePayment:dateFormated,success:true}).status(200)
            }
            else{
                return res.json({message:"User Not Exist In Payment",activePayment:findUser,success:true}).status(200)
            }
        }).catch(err=>{
            console.log("err",err)
        return res.json({error:{message:"Catch ERRor while finding single active User Date",errorCode:500},success:false}).status(400)
    })
})
module.exports=Router;
// 