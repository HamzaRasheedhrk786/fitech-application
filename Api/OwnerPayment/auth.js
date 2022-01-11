const Router= require("express").Router();
// aquiring ownerPyemnt schema
const {OwnerPayment,CheckIn,Owner, Gym}= require("../../Models")
// aquring ownerpayment vslidations
const {OwnerPaymentValidation}=require("../../Validation/ownerPaymentValidator")
// image
const myUpload = require("../../Storage/storage").upload;
// getting response
Router.get("/",(req,res)=>{
    return res.json({message:"Getting the Response Of Owner Payment"})
})
// sending amount to gym owner against gym
Router.post("/send", myUpload.array('Image',1),(req,res)=>
{
    // decalring object for taking data from body
    let ownerPayment = JSON.parse(req.body.ownerPayment);
    // const {event}=req.body;
    console.log("Add service Input");
    console.log(ownerPayment);
    // console.log(req.files);
    let url = `/image/${req.files[0].filename}`;
    // console.log( url );
    // validating schema of ownerpayment by joi validator 
    OwnerPaymentValidation.validateAsync(ownerPayment).then(validated=>
        {
            if(validated)
            {
                Owner.findOne({_id:ownerPayment.owner}).then(ownerExist=>
                    {
                        if(!ownerExist)
                        {
                            return res.json({error:{message:"Owner Not Exist Against Id",errorCode:500},success:false}).status(400)
                        }
                        else
                        {
                            Gym.findOne({_id:ownerPayment.gym}).then(gymExist=>{
                                if(!gymExist)
                                {
                                    return res.json({error:{message:"Gym Not Exist Against Id",errorCode:500},success:false}).status(400)
                                }
                                else 
                                {
                                    // console.log("gym",gymExist)
                                    if(gymExist.ownerId==ownerPayment.owner)
                                    {
                                        // console.log("gym",gymExist)
                                        // console.log("owner",gymExist.ownerId)
                                        // console.log("inputowner",ownerPayment.owner)
                                        // console.log("value",(gymExist.ownerId==ownerPayment.owner))
                                        CheckIn.find({gym:ownerPayment.gym,status:"active"}).count().then(userRecord=>
                                            {
                                                console.log(userRecord)
                                                if(userRecord)
                                                {
                                                    console.log(gymExist.monthlyFee)
                                                    let revenue= (gymExist.monthlyFee/30)*(userRecord);
                                                    console.log(revenue);
                                                    console.log("match",(ownerPayment.amount==revenue))
                                                    // if(ownerPayment.amount==revenue){
                                                      
                                                    
                                                    let payment= new OwnerPayment({
                                                        owner:ownerPayment.owner,
                                                        gym:ownerPayment.gym,
                                                        amount:ownerPayment.amount,
                                                        image:url
                                                    })
                                                    payment.save().then(savedPayment=>
                                                        {
                                                            if(savedPayment){
                                                                CheckIn.updateMany({gym:ownerPayment.gym},{$set:{status:"drafted"}}).then(savedPay=>
                                                                    {
                                                                        if(savedPay)
                                                                        {
                                                                            return res.json({message:"Record Saved Successfully",payment:savedPayment,success:true}).status(200)
                                                                        }
                                                                        else
                                                                        {
                                                                            return res.json({error:{message:"Owner Payment Record Failed To Saved",errorCode:500},success:false}).status(400)
                                                                        }

                                                                    }).catch(err=>
                                                                        {
                                                                            console.log(err)
                                                                            return res.json({error:{message:"Catch Error While CHanging  Check In Status",errorCode:500},success:false}).status(400)
                                                                                  })
                                                                                  
                                                            }
                                                            else
                                                            {
                                                                 return res.json({error:{message:"Failed To Save Owner Payment Data",errorCode:500},success:false}).status(400)
                                                            }
                                                        }).catch(err=>
                                                {
                                                    console.log(err)
                                                    return res.json({error:{message:"Catch Error While Saving OwnerPayment Data",errorCode:500},success:false}).status(400)
                                                })
                                                    // return res.json({message:"User Record Found Against Gym",gymRevenue:revenue,success:true}).status(200)
                                                // }
                                                // else
                                                // {
                                                //     return res.json({error:{message:"Amount Didnt Matched",errorCode:500},success:false}).status(400)
                                                // }
                                            }
                                                else
                                                {
                                                    return res.json({error:{message:"No Revenue Exist Against Gym",errorCode:500},success:false}).status(400)
                                                }
                                            }).catch(err=>
                                                {
                                                    console.log(err)
                                                    return res.json({error:{message:"Catch Error While Finding Gym In User Check In",errorCode:500},success:false}).status(400)
                                                })
                                        
                                    } 
                                    else
                                    {
                                        return res.json({error:{message:"Owner Gym Hasen't Exists",errorCode:500},success:false}).status(400)
                                    }  
                                }

                            }).catch(err=>
                                {
                                    return res.json({error:{message:"Catch Error While Finding Gym Against Id",errorCode:500},success:false}).status(400)
                                })
                        }
                    }).catch(err=>
                        {
                            return res.json({error:{message:"Catch Error While Finding Owner Against Id",errorCode:500},success:false}).status(400)
                        })
            }
            else
            {
                return res.json({error:{message:"Joi Validations Failed For Owner Payment",errorCode:500},success:false}).status(400)
            }
        }).catch(err=>{
            if(err.isJoi===true){
                return res.json({error:{message:err.message, errorCode:500},success:false}).status(400);
            }else{
                return res.json({error:{message:"Catch Error,Sending Payment To Owner", errorCode:500}, success:false}).status(400);
            }
        })
})
module.exports=Router;