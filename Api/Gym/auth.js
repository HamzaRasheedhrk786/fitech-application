const Router= require('express').Router();
// exporting model gym7
const {Gym, Owner, Service, CheckIn}=require("../../Models")
const {addGymValidation, updateGymValidation}=require("../../Validation/gymValidator")
// const {upload} = require("../../storage")();
const myUpload = require("../../Storage/storage").upload;

// getting the gym response
Router.get("/record",(req,res)=>
{
    Gym.find()
    .populate("services","name image")
    .populate("ownerId","name email")
    .then(allGym=>
        {
            if(allGym)
            {

                return res.json({message:"All Gym Record In System",gym:allGym,success:true}).status(200)
            }
            else
            {
                return res.json({error:{message:"Error Finding Gym Record",errorCode:500},success:false}).status(400)
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error While Finding Gym Record",errorCode:500},success:false}).status(400)
            })
})
// Adding Gym
Router.post("/addGym",myUpload.array("uploadImage"),(req,res)=>{
    // const {gym}=req.body;
    let gym = JSON.parse(req.body.gym);
    console.log("Add Gym Input");
    console.log(gym);
    console.log(req.files);
    // for adding multiple images
    let newImages = [];
    for (let index = 0; index < req.files.length; index++) {
    const element = req.files[index];
    newImages.push(`/image/${req.files[0].filename}`)
    }
    //   for adding multiple service
    //  let newArray=[];
    //  newArray.push(gym.services)
    
      addGymValidation.validateAsync(gym).then(validated=>{
          if(validated)
          {
              Owner.findOne({_id:gym.ownerId}).then(ownerFound=>
                {
                    if(!ownerFound)
                    {
                        return res.json({error:{message:"Gym Owner Not Exist Against Id",errorCode:500},success:false}).status(400);
                    }
                    else
                    {
                        Service.findOne({_id:gym.services}).then(foundService=>
                            {
                                console.log("object",foundService) 
                                // foundService.map(singleValue=>
                                //     {
                                //         console.log("singleValue",singleValue)
                                        if(!foundService || foundService===null){
                                            return res.json({error:{message:"Service Not Exist Against Id",errorCode:500},success:false}).status(400);
                                        }
                                        else
                                        {
                                            Gym.findOne({name:gym.name}).then(findGym=>
                                                {
                                                    if(findGym)
                                                    {
                                                        return res.json({error:{message:"Gym Name Already Exist",errorCode:500},success:false}).status(400)
                                                    }
                                                    else
                                                    {
                                  
                                                        const addGym= new Gym({
                                                            images:newImages,
                                                            ownerId:gym.ownerId,
                                                            name:gym.name,
                                                            city:gym.city,
                                                            contactNumber:gym.contactNumber,
                                                            monthlyFee:gym.monthlyFee,
                                                            gymAddress:gym.gymAddress,
                                                            services:gym.services
                                
                                                        })
                                                        addGym.save().then(saveGym=>
                                                            {
                                                                if(saveGym)
                                                                {
                                                                    return res.json({message:"Gym Added Successfully",gym:saveGym,success:true}).status(200);
                                                                }
                                                                else
                                                                {
                                                                    return res.json({error:{message:"Failed TO Save Gym Data", errorCode:500},success:false}).status(400);
                                                                }
                                
                                                            }).catch(err=>
                                                                {
                                                                    console.log(err)
                                                                    return res.json({error:{message:"Catch Error While Saving Gym Data", errorCode:500},success:false}).status(400);  
                                                                })
                                                    }
                                                }).catch(err=>
                                                    {
                                                      return res.json({error:{message:"Catch Error While Finding Gym Against Name", errorCode:500},success:false}).status(400);
                                                    })
                                
                                        }
                                    // })
                                
                            }).catch(err=>{
                                console.log(err)
                                return res.json({error:{message:"Catch Error Service Not Exist Against Id",errorCode:500},success:false}).status(400);
                            })
                    }
                }).catch(err=>
                    {
                        return res.json({error:{message:"Catch Errror While Finding Gym Owner Against Id",errorCode:500},success:false}).status(400);
                    })
            }
          else
          {
            return res.json({error:{message:"Add Gym Validation Failed", errorCode:500},success:false}).status(400);
          }

      }).catch(err=>{
        if(err.isJoi===true){
            return res.json({error:{message:err.message, errorCode:500},success:false}).status(400);
        }else{
            return res.json({error:{message:"Catch Error,Adding Error", errorCode:500}, success:false}).status(400);
        }
    })

})
// Updating Gym Location
// Router.patch("/update",(req,res)=>
// {
//     const {gym}=req.body;
//     updateGymValidation.validateAsync(gym).then(validated=>
//         {
//             if(validated)
//             {
//                 Gym.findOne({_id:gym._id}).then(foundGym=>
//                     {
//                         if(!foundGym)
//                         {
//                             return res.json({error:{message:"Gym Not Find Against Id",errorCode:500},success:false}).status(400)
//                         }
//                         else
//                         {
//                             Gym.findOneAndUpdate({_id:gym._id},{$set:{gymAddress:foundGym.address}}).then(found=>
//                                 {
//                                     if(found)
//                                     {

//                                         Gym.findOne({_id:gym._id}).then(updated=>
//                                             {
            
//                                                 return res.json({message:"Location Updated Successfully",updatedLocation:updated,success:true}).status(200)
//                                             })
//                                     }
//                                 })
//                         }
//                     }).catch(err=>{
//                         return res.json({error:{message:"Catch Error While Finding Gym Against Id",errorCode:500},success:false}).status(400)
//                     })
//             }
//             else
//             {
//                 return res.json({error:{message:"Updating Gym Validation Error",errorCode:500},success:false}).status(400)
//             }
//         }).catch(err=>{
//             if(err.isJoi===true){
//                 return res.json({error:{message:err.message, errorCode:500},success:false}).status(400);
//             }else{
//                 return res.json({error:{message:"Catch Error,Updating Error", errorCode:500}, success:false}).status(400);
//             }
//         })
    
// })
// activate gym against gym id by owner
Router.patch("/changeStatus",(req,res)=>
{
    const {gym} =req.body;
    Gym.findOne({_id:gym.gymId}).then(findGym=>
        {
            if(!findGym)
            {
                return res.json({error:{message:"Gym Not Exist Against Id", errorCode:500}, success:false}).status(400);
            }
            else if(findGym && findGym.status==="active")
            {
                return res.json({error:{message:"Gym Status Already Activate", errorCode:500}, success:false}).status(400);
            }
            else
            {
                Gym.findOneAndUpdate({_id:gym.gymId},{$set:{status:gym.status}}).then(updatedGym=>
                    {
                        if(!updatedGym)
                        {
                            return res.json({error:{message:"Gym Status Not Updated", errorCode:500}, success:false}).status(400);
                        }
                        else
                        {
                            Gym.findOne({ _id:gym.gymId })
                            .then( foundGym => {
                                return res.json({ message: "Gym Found and Update",  gym: foundGym, success: true })
                            } )
                            .catch( err => {
                            return res.json({ error: { message: "Catch Error, Getting Gym", errorCode: 500 }, success: false }).status( 400 );
                            } )
                            
                        }
                    }).catch(err=>
                        {
                            return res.json({error:{message:"Catch Error, Updating Gym Status", errorCode:500}, success:false}).status(400);
                        })
            }

        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error,While Finding Gym Against Id", errorCode:500}, success:false}).status(400);
            })
})
// /allActive/records
Router.get("/allActive/records",(req,res)=>
{
    Gym.find({status:"active"}).populate("ownerId","name email").populate("services","name image").then(activeGyms=>
        {
            if(!activeGyms)
            {
                return res.json({error:{message:"No Gym Find", errorCode:500}, success:false}).status(400);
            }
            else
            {
                return res.json({message:"All Active Gym Records",gym:activeGyms,success:true}).status(200)
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error,While Finding Active Gym Record", errorCode:500}, success:false}).status(400);
            })
})
// /allActive/records
Router.get("/allInactive/records",(req,res)=>
{
    Gym.find({status:"inactive"}).populate("ownerId","name email").populate("services","name image").then(activeGyms=>
        {
            if(!activeGyms)
            {
                return res.json({error:{message:"No Gym Find", errorCode:500}, success:false}).status(400);
            }
            else
            {
                return res.json({message:"All Inactive Gym Records",gym:activeGyms,success:true}).status(200)
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error,While Finding Active Gym Record", errorCode:500}, success:false}).status(400);
            })
})
// get all gym against owner
Router.get("/owner/allgym",(req,res)=>
{
    const {ownerId}=req.query;
    Owner.findOne({_id:ownerId}).then(ownerFound=>
        {
            if(!ownerFound)
            {
                return res.json({error:{message:"Gym Owner Not Found Against Id",errorCode:500},success:false}).status(400)
            }
            else
            {
                Gym.find({ownerId:ownerId}).populate("ownerId","name email").populate("services","name image").then(ownerGym=>
                    {
                        if(!ownerGym)
                        {
                            return res.json({error:{message:"Gym Not Found Against Owner",errorCode:500},success:false}).status(400)
                        }
                        else
                        {
                            return res.json({message:"All Gym Found Against Owner",ownerAllGym:ownerGym,success:true}).status(200)
                        }
                    }).catch(err=>
                        {
                            return res.json({error:{message:"Catch Error, Gym Not Found Against Owner",errorCode:500},success:false}).status(400)
                        })
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error, Gym Owner Not Found Against Id",errorCode:500},success:false}).status(400)
            })
    
})
// get all gym against owner
Router.get("/owner/allActiveGym",(req,res)=>
{
    const {ownerId}=req.query;
    Owner.findOne({_id:ownerId}).then(ownerFound=>
        {
            if(!ownerFound)
            {
                return res.json({error:{message:"Gym Owner Not Found Against Id",errorCode:500},success:false}).status(400)
            }
            else
            {
                Gym.find({ownerId:ownerId,status:"active"}).populate("ownerId","name email").populate("services","name image").then(ownerGym=>
                    {
                        if(!ownerGym)
                        {
                            return res.json({error:{message:"Gym Not Found Against Owner",errorCode:500},success:false}).status(400)
                        }
                        else
                        {
                            return res.json({message:"All Active Gym Found Against Owner",ownerAllActiveGym:ownerGym,success:true}).status(200)
                        }
                    }).catch(err=>
                        {
                            return res.json({error:{message:"Catch Error, Gym Not Found Against Owner",errorCode:500},success:false}).status(400)
                        })
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error, Gym Owner Not Found Against Id",errorCode:500},success:false}).status(400)
            })
    
})
// get all gym against owner
Router.get("/owner/allInactiveGym",(req,res)=>
{
    const {ownerId}=req.query;
    Owner.findOne({_id:ownerId}).then(ownerFound=>
        {
            if(!ownerFound)
            {
                return res.json({error:{message:"Gym Owner Not Found Against Id",errorCode:500},success:false}).status(400)
            }
            else
            {
                Gym.find({ownerId:ownerId,status:"inactive"}).populate("ownerId","name email").populate("services","name image").then(ownerGym=>
                    {
                        if(!ownerGym)
                        {
                            return res.json({error:{message:"Gym Not Found Against Owner",errorCode:500},success:false}).status(400)
                        }
                        else
                        {
                            return res.json({message:"All Inactive Gym Found Against Owner",ownerAllActiveGym:ownerGym,success:true}).status(200)
                        }
                    }).catch(err=>
                        {
                            return res.json({error:{message:"Catch Error, Gym Not Found Against Owner",errorCode:500},success:false}).status(400)
                        })
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error, Gym Owner Not Found Against Id",errorCode:500},success:false}).status(400)
            })
    
})
// deleting gym by owner
Router.delete("/owner/deleteGym",(req,res)=>
{
    const {gym}=req.body;
    Gym.findOne({ownerId:gym.ownerId}).then(ownerFind=>
        {
            if(!ownerFind)
            {
                return res.json({error:{message:"Error While Finding Owner In Gym",errorCode:500},success:false}).status(400)
            }
            else
            {
                Gym.findOne({_id:gym._id}).then(findGym=>
                    {
                        if(!findGym)
                        {
                            return res.json({error:{message:"Error While Finding Gym Against Id",errorCode:500},success:false}).status(400)
                        }
                        else if(findGym.status==="active")
                        {
                            return res.json({error:{message:"You Cannot Delete Active Gym",errorCode:500},success:false}).status(400)
                        }
                        else if(findGym.status==="inactive")
                        {
                            Gym.findOneAndRemove({_id:findGym._id}).then(gymRemoved=>
                                {
                                    if(!gymRemoved){
                                        return res.json({error:{message:"Failed To Remove Gym",errorCode:500},success:false}).status(400)
                                    }
                                    else
                                    {
                                        return res.json({message:"Gym Removed Successfully",gym:gymRemoved,success:true}).status(200)
                                    }

                                }).catch(err=>
                                    {
                                        return res.json({error:{message:"Catch Error While Removing Gym",errorCode:500},success:false}).status(400)  
                                    })
                        }
                    }).catch(err=>
                        {
                            return res.json({error:{message:"Catch Error While Finding Gym Against Id",errorCode:500},success:false}).status(400)
                        })
            }
        }).catch(err=>{
            return res.json({error:{message:"Catch Error While Finding Owner In Gym",errorCode:500},success:false}).status(400)
        })
})
// Finding gym user agaisnt gym in checkin
Router.get("/user",(req,res)=>
{
    const {gym} =req.query;
    Gym.findOne({_id:gym}).then(findGym=>
        {
            if(!findGym)
            {
                return res.json({error:{message:"Gym Not Exists Against Id",errorCode:500},success:false}).status(400)
            }
            else
            {
                CheckIn.find({gym:gym}).populate("user","firstName email image").then(userRecord=>
                    {
                        if(userRecord)
                        {
                            return res.json({message:"User Record Found Against Gym",gymUser:userRecord,success:true}).status(200)
                        }
                        else
                        {
                            return res.json({error:{message:"Erroe While Finding Gym User",errorCode:500},success:false}).status(400)
                        }
                    }).catch(err=>
                        {
                            return res.json({error:{message:"Catch Error While Finding Gym In User Check In",errorCode:500},success:false}).status(400)
                        })
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error While Finding Gym In Gym",errorCode:500},success:false}).status(400)
            })
}) 
// total visits against gym
Router.get("/visits",(req,res)=>
{
    const {gym} =req.query;
    Gym.findOne({_id:gym}).then(findGym=>
        {
            if(!findGym)
            {
                return res.json({error:{message:"Gym Not Exists Against Id",errorCode:500},success:false}).status(400)
            }
            else
            {
                CheckIn.find({gym:gym,status:"active"}).count().then(userRecord=>
                    {
                        if(userRecord)
                        {
                            return res.json({message:"User Record Found Against Gym",gymVisits:userRecord,success:true}).status(200)
                        }
                        else
                        {
                            return res.json({error:{message:"Erroe While Finding Gym User",errorCode:500},success:false}).status(400)
                        }
                    }).catch(err=>
                        {
                            return res.json({error:{message:"Catch Error While Finding Gym In User Check In",errorCode:500},success:false}).status(400)
                        })
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error While Finding Gym In Gym",errorCode:500},success:false}).status(400)
            })   
})
// get gym revenue against gym
Router.get("/revenue",(req,res)=>
{
    const {gym} =req.query;
    Gym.findOne({_id:gym}).then(findGym=>
        {
            if(!findGym)
            {
                return res.json({error:{message:"Gym Not Exists Against Id",errorCode:500},success:false}).status(400)
            }
            else
            {
                CheckIn.find({gym:gym,status:"active"}).count().then(userRecord=>
                    {
                        if(userRecord)
                        {
                            console.log(findGym.monthlyFee)
                            let revenue= (findGym.monthlyFee/30)*(userRecord);
                            console.log(revenue);
                            return res.json({message:"User Record Found Against Gym",gymRevenue:revenue,success:true}).status(200)
                        }
                        else
                        {
                            return res.json({error:{message:"Erroe While Finding Gym User",errorCode:500},success:false}).status(400)
                        }
                    }).catch(err=>
                        {
                            return res.json({error:{message:"Catch Error While Finding Gym In User Check In",errorCode:500},success:false}).status(400)
                        })
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error While Finding Gym In Gym",errorCode:500},success:false}).status(400)
            })
})
//  calculating vists against date
Router.get("/visits/date",(req,res)=>
{
    const{gym,date}=req.query;
    Gym.findOne({_id:gym}).then(gymFound=>
        {
            if(!gymFound)
            {
                return res.json({error:{message:"Gym Not Exist Against Id",errorCode:500},success:false}).status(400)   
            }
            else{
                CheckIn.find({gym:gym}).then(GymRecord=>
                    { 
                        console.log(GymRecord)
                        if(!GymRecord)
                        {
                            return res.json({error:{message:"Gym Not Exist In CheckIn Against Id ",errorCode:500},success:false}).status(400)
                        }
                        else
                        {
                            CheckIn.find({checkInDate:date,status:"active"}).count().then(visitAgainstDate=>
                                {
                                    console.log("visis",visitAgainstDate)
                                    if(!visitAgainstDate)
                                    {
                                        return res.json({error:{message:"No Visit Exist Against This Date",errorCode:500},success:false}).status(400)
                                    }
                                    else{
                                        console.log("visists",visitAgainstDate)
                                        return res.json({message:"Visits Exists Against Date",visits:visitAgainstDate,success:true}).status(200)
                                    }
                                }).catch(err=>
                                    {
                                        console.log(err)
                                        return res.json({error:{message:"Catch Error While Finding Visits Against Date In CheckIn",errorCode:500},success:false}).status(400)       
                                    })
                        }
                    }).catch(err=>
                        {
                            console.log(err)
                            return res.json({error:{message:"Catch Error While Finding Gym In CheckIn",errorCode:500},success:false}).status(400)
                        })
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error While Finding Gym",errorCode:500},success:false}).status(400)
            })
})
// gym active user
Router.get("/users",(req,res)=>
{
    const {gymId}=req.query;
    Gym.findOne({gym:gymId}).then(gymFound=>
        {
            if(!gymFound)
            {
                return res.json({error:{message:"Gym Not Exists Against Id",errorCode:500},success:false}).status(400)
            }
            else
            {
                CheckIn.find({gym:gymId,status:"active"}).populate("user","firstName email image").then(gymFnd=>
                    {
                        if(!gymFnd)
                        {
                            return res.json({error:{message:"No Check In Record Exist Against Gym",errorCode:500},success:false}).status(400) 
                        }
                        else{
                            return res.json({message:"User CheckIn Records Agaisnt Gym",users:gymFnd,success:true}).status(200) 
                        }
                    }).catch(err=>
                        {
                            return res.json({error:{message:"Catch Error, No Check In Record Exist Against Gym",errorCode:500},success:false}).status(400) 
                        })
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error, Gym Not Exists Against Id",errorCode:500},success:false}).status(400)
            })

})

module.exports=Router;