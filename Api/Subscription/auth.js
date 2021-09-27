const Router=require("express").Router();
// require subscription model
const {Subscription, User, UserPayment}=require("../../Models");
// const userPayment = require("../../Models/userPayment");
// require joi validation of model
const {subscriptionValidation,subscriptionEdit,subscriptionAssignment}= require("../../Validation/subscriptionValidator")
// require storage for image
// const {upload} = require("../../storage")();
const upload = require("../../Storage/storage").upload;
// Getting All Subscription
Router.get("/getSubscription",(req,res)=>{
    Subscription.find().populate("userId","email firstName").then(allSub=>
        {
            if(allSub){

                return res.json({message:"All Subscription are Found",subscriptions:allSub,success:true}).status(200);
            }
            else
            {
                return res.json({error:{message:"Subscription are not found",errorCode:500},success:false}).status(400)
            }
            
        }).catch(err=>
            {
                console.log(err)
                return res.json({error:{message:"Catch Error While Getting subscription",errorCode:500},success:false}).status(400)
            })
})
// creating subscription
Router.post("/addSubscription", upload.array('uploadImage',1),(req, res)=>{
    let subscription = JSON.parse(req.body.subscription);
    // const {event}=req.body;
    console.log("Add subscription Input");
    console.log(subscription);
    console.log(req.files);
    let url = `/image/${req.files[0].filename}`;
    console.log( url );
    // const {event}=req.body;
    subscriptionValidation.validateAsync(subscription)
        .then(eventValidated=>{
            Subscription.findOne({name:subscription.name})
                .then(newEvent=>{
                   if(newEvent!==null){
                        return res.json({error:{message:"Subscription Already Exists", errorCode:500}, success:false}).status(500);
                   }
                  else{
                        const addSubscription=new Subscription({
                            name:subscription.name,
                            description:subscription.description,
                            amount:subscription.amount,
                            image:url
                        })     
                        addSubscription.save().then(saveSub=>{
                            return  res.json({message:"Subscription Added", subscription: saveSub, success:true}).status(200);
                        }).catch(err=>{
                            return res.json({error:{message:"Subscription Not Added",err, errorCode: 500}, success:false}).status(500)
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
// updating subscription
Router.patch("/updateSubscription",upload.array('uploadImage',1),(req,res)=>{
    let subscription = JSON.parse(req.body.subscription);
    console.log("Edit Subscription Input");
    console.log(Subscription);
    console.log("subscription Image Uploading");
    console.log(req.files);
    let url = `/image/${req.files[0].filename}`;
    console.log( url );

    subscriptionEdit.validateAsync(subscription)
        .then(eventValidatd=>{
            Subscription.findOne({_id:subscription._id})
                .then(subscriptionId=>{
                    if(!subscriptionId){
                        return res.json({error:{message:"Subscription Not Exists", errorCode:500}, success:false}).status(500);
                    }
                    else{
                        Subscription.updateOne({_id:subscription._id}, {$set:{name:subscription.name, description:subscription.description,amount:subscription.amount, image:url
                        }
                        }).then(updateSubscription=>{
                            console.log( "updateSubscription.n" )
                            console.log( updateSubscription.n );
                            Subscription.findOne({_id:subscription._id})
                                .then(foundSubscription=>{
                                    if(updateSubscription.n===1){
                                        return res.json({message:"Subscription Updated",subscription:foundSubscription, success:true}).status(200)
                                    }
                                    else{
                                        return res.json({error:{message:"Subscription not Updated", errorCode:500}, success:false}).status(500); 
                                    }
                                }).catch( err => {
                                    return res.json({ error: { message: "Catch Error, Getting Subscription", errorCode: 500 }, success: false })
                                    .status( 500 );
                                } )
                        }).catch(err=>{
                            return res.json({error:{message:"Catch Error Subscription Update", errorCode:500},success:false}).status(500);
                        })
                    }
                }).catch(err=>{
                    return res.json({ error: {  message: "Catch Error,Subscription Getting", errorCode : 500} , success: false}).status( 500 );
                })

            })
})
// Searching Subscription by name
Router.get("/searchSubscription",(req,res)=>{
    const {subscription}= req.body;
    Subscription.find({name:subscription.name}).populate("userId","firstName email").then(findSunscription=>{
        if(findSunscription===null)
        {
            return res.json({error:{message:"Subscription Not Found Against Name",errorCode:500},success:false}).status(400);
        }
        else
        {
            return res.json({message:"Subscription Found Against Name",subscription:findSunscription,success:true}).status(200)
        }
    }).catch(err=>
        {
            return res.json({error:{message:"Catch Error While Finding Subscription By Name",errorCode:500},success:false}).status(400);
        })
})
// Delete Subscription
Router.delete("/deleteSubscription",(req,res)=>{
    const {subscription}= req.body;
    // Subscription.findOne({userId:subscription.userId}).then(userExist=>
    //     {
    //         if(userExist!==null)
    //         {
    //             return res.json({error:{message:"Subscription Cannot Be Deleted Because User Exists",errorCode:500},success:false}).status(400);
    //         }
    //         else
    //         {
                Subscription.findByIdAndRemove({_id:subscription._id}).then(findSubscription=>
                    {
                        if(!findSubscription)
                        {
                            return res.json({error:{message:"You Can't Delete Because Subscription not Exists",errorCode:500},success:false}).status(400);
                        }
                        else if(findSubscription.userId!==null){
                            return res.json({error:{message:"You Can't Delete Because Subscription Had User",errorCode:500},success:false}).status(400);
                        }
                        else{
                            return res.json({message:"Subscription Deleted Successfully",subscription:findSubscription,success:true}).status(200);
                        }
                    }).catch(err=>
                        {
                            return res.json({error:{message:"Catch Error while finding subscription against id",errorCode:500},success:false}).status(400);
                        })
        //     }
        // }).catch(err=>{
        //     return res.json({error:{message:"Catch While Error Finding User In Subscription",errorCode:500},success:false}).status(400);
        // })
    
})
// getting subscription of particular user
Router.get("/userSubscription",(req,res)=>{
    const {subscription}= req.body;
    User.findOne({_id:subscription.userId}).then(userFound=>{
        if(userFound===null)
        {
            return res.json({error:{messsage:"User Not Exists",errorCode:500},success:false}).status(400)
        }
        else
        {
            Subscription.findOne({userId:subscription.userId}).select({userId:subscription.userId}).populate("_id","name amount description image").populate("userId","firstName email userID").then(userFnf=>{
                if(userFnf===null){
                    return res.json({error:{messsage:"User Not Exist In Subscription",errorCode:500},success:false}).status(400)
                }
                else
                {
                    return res.json({message:"User Subscription Found",userSubscription:userFnf,success:true}).status(200)
                }
            })
        }
    }).catch(err=>{
        return res.json({error:{messsage:"Catch Error User Not Exists",errorCode:500},success:false}).status(400)
    })
})

// Assign Subscription to user
Router.patch("/assignSubscriptionUser",(req,res)=>{
    const {subscription} = req.body;
    subscriptionAssignment.validateAsync(subscription).then(validated=>{
        Subscription.findOne({_id:subscription._id}).then(findSub=>{
            if(findSub===null)
            {
                return res.json({error:{message:"Subscription Not Exists Against Id",errorCode:500},success:false}).status(400);
            }
            else
            {
                User.findOne({_id:subscription.userId}).then(findUser=>{
                    if(findUser===null)
                    {
                      return res.json({error:{message:"User Not Exists Against Id",errorCode:500},success:false}).status(400);
                    }
                    else{
                        Subscription.findOne({userId:subscription.userId}).then(findSubUser=>{
                            if(findSubUser!==null)
                            {
                               return res.json({error:{message:"User Already Had Subscription",errorCode:500},success:false}).status(400);
                            }
                            else
                            {
                                UserPayment.findOne({subscriptionId:subscription._id}).then(findSubPayment=>{
                                    if(findSubPayment===null){
                                        return res.json({error:{message:"Subscription Not Exist In Payment Table",errorCode:500},success:false}).status(400);
                                    }
                                    else
                                    {
                                        UserPayment.find({userId:subscription.userId}).sort({_id:-1}).limit(1).then(findUserPayment=>{
                                            // console.log(findUserPayment.subscriptionId);
                                            console.log(findUserPayment)
                                            findUserPayment.map(singleUser=>{
                                                if(singleUser && singleUser.status==="inactive")
                                                {
                                                    return res.json({error:{message:"You cant Assign Subscription Because User Payement Status Is Inactive",errorCode:500},success:false}).status(400)
                                                }
                                                else if(singleUser.subscriptionId==subscription._id) 
                                            {
                                                UserPayment.findOne({userId:subscription.userId},{status:"active"}).then(userFnd=>{
                                                    if(userFnd)
                                                    {
                                                    // console.log(findUserPayment.status)   
                                                let newUser = [];
                                                newUser.push(subscription.userId)
                                            //    for (let index = 0; index < subscription.userId; index++) {
                                            //     const element = subscription.userId[index];
                                            //     newUser.push(element.userId[index])
                                                // }
                                               Subscription.findOneAndUpdate({_id:subscription._id},{$push:{"userId":newUser}}).populate("userId","name email").select("-userId").then(updateSub=>{
                                                   if(!updateSub)
                                                   {
                                                       console.log(updateSub)
                                                    return res.json({error:{message:"Subcription Failed To Assign User",errorCode:500},success:false}).status(400);
                                                   }
                                                   else{
                                                    // let newUser = [];
                                                    // for (let index = 0; index < subscription.userId.length; index++) {
                                                    //   const element = subscription.userId[index];
                                                    //   newUser.push(element.userId)
                                                    // }
                                                    updateSub.save().then(Updated=>{
                                                        if(Updated){
                                                        return res.json({message:"Subscription Successfully Assigned To User",subscription:Updated,success:true}).status(200)
                                                        }
                                                        else
                                                        {
                                                            return res.json({error:{message:"Subcription Failed",errorCode:500},success:false}).status(400);
                                                        }
                                                        
                                                    })
                                                   }
                                               }).catch(err=>{
                                                   console.log(err)
                                                return res.json({error:{message:"Catch Error While Assignning Subscription To User",errorCode:500},success:false}).status(400);
                                            })
                                  
                                                    }
                                                })  
                                            }
                                                else
                                                {
                                                    return res.json({error:{message:"User Payment Not Exist In Payment Table Against Current Subscription",errorCode:500},success:false}).status(400);
                                                }
                                            })
                                            
                                        }).catch(err=>{
                                            console.log(err)
                                            return res.json({error:{message:"Catch Error While Finding User In User Payment Table",errorCode:500},success:false}).status(400);
                                        })
                                    }
                                }).catch(err=>{
                                    return res.json({error:{message:"Catch Error While Finding Subscription In User Payment Table",errorCode:500},success:false}).status(400);
                                })
                            }
                        }).catch(err=>{
                            return res.json({error:{message:"Catch Error While Finding User In Subscription Table",errorCode:500},success:false}).status(400);
                        })
                    }
                }).catch(err=>{
                    return res.json({error:{message:"Catch Error While Finding User Against Id",errorCode:500},success:false}).status(400);
                })
            }
        }).catch(err=>{
            return res.json({error:{message:"Catch Error While Finding Subscription Against Id",errorCode:500},success:false}).status(400);
        })
    }).catch(err=>{
        if(err.isJoi===true){
            return res.json({error:{message:err.message, errorCode:500},success:false});
        }else{
            return res.json({error:{message:"Catch Error, Subscription Assignment Error", errorCode:500}, success:false}).status(500);
        }
    })
    

})

// calculating 30days cancel user subscription
Router.patch("/cancelSubscriptionUser",(req,res)=>{
    const {subscription}=req.body;
    User.findOne({_id:subscription.userId}).then(findUser=>{
        if(!findUser)
        {
            return res.json({error:{message:"User Not EXIST Against Id",errorCode:500},success:false}).status(400)
        }
        else
        {
            Subscription.findOne({userId:subscription.userId}).then(foundUserSub=>{
                if(!foundUserSub)
                {
                    return res.json({error:{message:"User Not Have Subscription",errorCode:500},success:false}).status(400)
                }
                else{
                    UserPayment.findOne({userId:subscription.userId}).sort({_id:-1}).limit(1).then(findUserRec=>{
                        if(!findUserRec)
                        {
                          return res.json({error:{message:"User Not Have Payment Record",errorCode:500},success:false}).status(400)
                        }
                        else{
                            console.log("existing date",findUserRec.paymentDate)
                        let date = new Date(findUserRec.paymentDate);
                        date.setDate(date.getDate() + 30);
                        console.log("date",date);
                        console.log("diff",(date-findUserRec.paymentDate===30))
                           if(date-findUserRec.paymentDate===30)
                           {
                               UserPayment.findOneAndUpdate({userId:subscription.userId},{$set:{status:"inactive"}}).sort({_id:-1}).then(fnd=>{
                                   console.log("aas")
                                   console.log(fnd)
                                   console.log("userId",subscription.userId)
                                   console.log("found",fnd.userId)
                                   if(fnd)
                                   {
                                    Subscription.findOneAndUpdate({userId:subscription.userId},{$pull:{"userId":subscription.userId}}).select("-userId").then(updatedSub=>{
                                        if(updatedSub){
                                        return res.json({message:"User Removed From Subscription",subscription:updatedSub,success:true}).status(200)
                                     // Subscription.find().then(userfound=>{
                                     //     return res.json({message:"User Removed From Subscription",subscription:userfound,success:true}).status(200)
                                     // })
                                        }
                                        else
                                        {
                                         return res.json({error:{message:"User Not Removed",errorCode:500},success:false}).status(400)
                                        }
                                    }).catch(err=>{
                                        console.log(err)
                                     return res.json({error:{message:"Catch Error Removing User",errorCode:500},success:false}).status(400)
                                    })
                                   }
                                   else
                                   {
                                    return res.json({error:{message:"User Payemnt staus error",errorCode:500},success:false}).status(400)
                                   }
                               }).catch(err=>
                                {
                                    return res.json({error:{message:"Catch Error updation stausts",errorCode:500},success:false}).status(400)
                                })
                               
                           }
                           else
                           {
                            return res.json({error:{message:"User Days Remainings",errorCode:500},success:false}).status(400)
                           }
                        } 
                    }).catch(err=>{
                        console.log(err)
                        return res.json({error:{message:"Catch Error User Payemnt Record",errorCode:500},success:false}).status(400)
                    })
                } 
            }).catch(err=>{
                return res.json({error:{message:"Catch Error User Not Have Subscription",errorCode:500},success:false}).status(400)
            })
        }
    }).catch(err=>{
        return res.json({error:{message:"Catch Error User Not EXIST Against Id",errorCode:500},success:false}).status(400)
    })
})
module.exports=Router







// Assign Subscription to user
// Router.patch("/assignSubscription",(req,res)=>{
//     const {subscription} = req.body;
//     subscriptionAssignment.validateAsync(subscription).then(validated=>{
//         Subscription.findOne({_id:subscription._id}).then(findSub=>{
//             if(findSub===null)
//             {
//                 return res.json({error:{message:"Subscription Not Exists Against Id",errorCode:500},success:false}).status(400);
//             }
//             else
//             {
//                 User.findOne({_id:subscription.userId}).then(findUser=>{
//                     if(findUser===null)
//                     {
//                       return res.json({error:{message:"User Not Exists Against Id",errorCode:500},success:false}).status(400);
//                     }
//                     else{
//                         Subscription.findOne({userId:subscription.userId}).then(findSubUser=>{
//                             if(findSubUser!==null)
//                             {
//                                return res.json({error:{message:"User Already Had Subscription",errorCode:500},success:false}).status(400);
//                             }
//                             else
//                             {
//                                 UserPayment.findOne({subscriptionId:subscription._id}).then(findSubPayment=>{
//                                     if(findSubPayment===null){
//                                         return res.json({error:{message:"Subscription Not Exist In Payment Table",errorCode:500},success:false}).status(400);
//                                     }
//                                     else
//                                     {
//                                         UserPayment.findOne({userId:subscription.userId}).then(findUserPayment=>{
//                                             // console.log(findUserPayment.subscriptionId);
//                                             // console.log(subscription._id);
//                                             if(findUserPayment===null){
//                                                 return res.json({error:{message:"User Not Exist In Payment Table",errorCode:500},success:false}).status(400);
//                                             }
//                                             else if(findUserPayment.subscriptionId==subscription._id && findUserPayment.status==="active")
//                                             {
//                                              console.log(findUserPayment.status)   
//                                                 let newUser = [];
//                                                 newUser.push(subscription.userId)
//                                             //    for (let index = 0; index < subscription.userId; index++) {
//                                             //     const element = subscription.userId[index];
//                                             //     newUser.push(element.userId[index])
//                                                 // }
//                                                Subscription.findOneAndUpdate({_id:subscription._id},{$push:{"userId":newUser}}).populate("userId","name email").then(updateSub=>{
//                                                    if(!updateSub)
//                                                    {
//                                                        console.log(updateSub)
//                                                     return res.json({error:{message:"Subcription Failed To Assign User",errorCode:500},success:false}).status(400);
//                                                    }
//                                                    else{
//                                                     // let newUser = [];
//                                                     // for (let index = 0; index < subscription.userId.length; index++) {
//                                                     //   const element = subscription.userId[index];
//                                                     //   newUser.push(element.userId)
//                                                     // }
//                                                     updateSub.save().then(Updated=>{
//                                                         if(Updated){
//                                                         return res.json({message:"Subscription Successfully Assigned To User",subscription:Updated,success:true}).status(200)
//                                                         }
//                                                         else
//                                                         {
//                                                             return res.json({error:{message:"Subcription Failed",errorCode:500},success:false}).status(400);
//                                                         }
                                                        
//                                                     })
//                                                    }
//                                                }).catch(err=>{
//                                                    console.log(err)
//                                                 return res.json({error:{message:"Catch Error While Assignning Subscription To User",errorCode:500},success:false}).status(400);
//                                             })
//                                             }
//                                             else{
//                                                 return res.json({error:{message:"You Can not Assign Subscription",errorCode:500},success:false}).status(400)
//                                             }
//                                         }).catch(err=>{
//                                             console.log(err)
//                                             return res.json({error:{message:"Catch Error While Finding User In User Payment Table",errorCode:500},success:false}).status(400);
//                                         })
//                                     }
//                                 }).catch(err=>{
//                                     return res.json({error:{message:"Catch Error While Finding Subscription In User Payment Table",errorCode:500},success:false}).status(400);
//                                 })
//                             }
//                         }).catch(err=>{
//                             return res.json({error:{message:"Catch Error While Finding User In Subscription Table",errorCode:500},success:false}).status(400);
//                         })
//                     }
//                 }).catch(err=>{
//                     return res.json({error:{message:"Catch Error While Finding User Against Id",errorCode:500},success:false}).status(400);
//                 })
//             }
//         }).catch(err=>{
//             return res.json({error:{message:"Catch Error While Finding Subscription Against Id",errorCode:500},success:false}).status(400);
//         })
//     }).catch(err=>{
//         if(err.isJoi===true){
//             return res.json({error:{message:err.message, errorCode:500},success:false});
//         }else{
//             return res.json({error:{message:"Catch Error, Subscription Assignment Error", errorCode:500}, success:false}).status(500);
//         }
//     })
    

// })



// calculating 30days cancel user subscription
// Router.patch("/cancelSubscription",(req,res)=>{
//     const {subscription}=req.body;
//     User.findOne({_id:subscription.userId}).then(findUser=>{
//         if(!findUser)
//         {
//             return res.json({error:{message:"User Not EXIST Against Id",errorCode:500},success:false}).status(400)
//         }
//         else
//         {
//             Subscription.findOne({userId:subscription.userId}).then(foundUserSub=>{
//                 if(!foundUserSub)
//                 {
//                     return res.json({error:{message:"User Not Have Subscription",errorCode:500},success:false}).status(400)
//                 }
//                 else{
//                     UserPayment.findOne({userId:subscription.userId}).then(findUserRec=>{
//                         if(!findUserRec)
//                         {
//                           return res.json({error:{message:"User Not Have Payment Record",errorCode:500},success:false}).status(400)
//                         }
//                         else{
//                             console.log(findUserRec.createdAt)
//                             let someDate = new Date(findUserRec.createdAt);
//                            someDate.setDate(someDate.getDate()+30); //number  of days to add, e.x. 15 days
//                            let dateFormated = someDate;
//                            console.log(dateFormated);
//                            if(dateFormated)
//                            {
//                                Subscription.findOneAndUpdate({userId:subscription.userId},{$pull:{"userId":subscription.userId}}).then(updatedSub=>{
//                                    if(updatedSub){
//                                    return res.json({message:"User Removed From Subscription",subscription:updatedSub,success:true}).status(200)
//                                 // Subscription.find().then(userfound=>{
//                                 //     return res.json({message:"User Removed From Subscription",subscription:userfound,success:true}).status(200)
//                                 // })
//                                    }
//                                    else
//                                    {
//                                     return res.json({error:{message:"User Not Removed",errorCode:500},success:false}).status(400)
//                                    }
//                                }).catch(err=>{
//                                    console.log(err)
//                                 return res.json({error:{message:"Catch Error Removing User",errorCode:500},success:false}).status(400)
//                                })
//                            }
//                            else
//                            {
//                             return res.json({error:{message:"User Days Remainings",errorCode:500},success:false}).status(400)
//                            }
//                         } 
//                     }).catch(err=>{
//                         return res.json({error:{message:"Catch Error User Payemnt Record",errorCode:500},success:false}).status(400)
//                     })
//                 } 
//             }).catch(err=>{
//                 return res.json({error:{message:"Catch Error User Not Have Subscription",errorCode:500},success:false}).status(400)
//             })
//         }
//     }).catch(err=>{
//         return res.json({error:{message:"Catch Error User Not EXIST Against Id",errorCode:500},success:false}).status(400)
//     })
// })