const Router= require("express").Router();
const {Gym, User, CheckIn, Subscription}=require("../../Models")
const {addCheckInValidation}=require("../../Validation/checkInValidator")

// getting response of checkIn server
Router.get("/",(req,res)=>
{
    CheckIn.find().then(allRecords=>
        {
            if(!allRecords)
            {
                return res.json({error:{message:"User Not Found",errorCode:500},success:false}).status(400)
            }
            else
            {
                return res.json({message:"All CheckIn Table Record",checkIn:allRecords,success:true}).status(200)
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error While Getting CheckIn Table Data",errorCode:500},success:false}).status(400)
            })
    // return res.json({message:"Check In Server Runinng"})
})
// posting checkIn request by user
Router.post("/user",(req,res)=>
{
    const {checkIn}=req.body
    // joi validation schema
    addCheckInValidation.validateAsync(checkIn).then(validated=>{
        if(validated)
        {
            User.findOne({_id:checkIn.user}).then(foundUser=>{
                if(!foundUser)
                {
                    return res.json({error:{message:"User Not Found Against Id In User Table",errorCode:500},success:false}).status(400)
                }
                else
                {
                    Gym.findOne({_id:checkIn.gym}).then(gymFound=>{
                        if(!gymFound)
                        {
                            return res.json({error:{message:"Gym Not Found Against Id In Gym Table",errorCode:500},success:false}).status(400)
                        }
                        else
                        {
                           Subscription.findOne({userId:checkIn.user}).then(subUser=>
                            {
                                if(!subUser)
                                {
                                    return res.json({error:{message:"User Not Have Subscrption",errorCode:500},success:false}).status(400)
                                }
                                else
                                {
                                    CheckIn.findOne({user:checkIn.user}).sort({"_id":-1}).limit(1).then(findCheckInUser=>
                                        {
                                            console.log("user",findCheckInUser)
                                            if(!findCheckInUser)
                                            {
                                                if(subUser.amount>=gymFound.monthlyFee)
                                                {
                                                    const addCheckIn= new CheckIn({
                                                        user:checkIn.user,
                                                        gym:checkIn.gym
                                                    })
                                                    addCheckIn.save().then(saveCheckIn=>
                                                        {
                                                            if(saveCheckIn)
                                                            {
                                                                return res.json({message:"CheckIn Successfully Done",checkIn:saveCheckIn,success:true}).status(200)
                                                            }
                                                            else
                                                            {
                                                                return res.json({error:{message:"Failed To Save Check In Data",errorCode:500},success:false}).status(400)
                                                            }
                                                        }).catch(err=>
                                                            {
                                                                return res.json({error:{message:"Catch Error While Saving Check In Data",errorCode:500},success:false}).status(400)
                                                            })
                                                }
                                                else
                                                {
                                                    return res.json({error:{message:"Your ssd Subscription Is Not Valid For This Gym",errorCode:500},success:false}).status(400)
                                                }
                                            }
                                            else
                                            {
                                                console.log(findCheckInUser)
                                                // CheckIn.find({user:checkIn.user}).sort({"_id":-1}).limit(1).then(userData)
                                                console.log("existing date",findCheckInUser.checkInDate)
                                                let date = new Date(findCheckInUser.checkInDate);
                                                date.setHours(0,0,0,0);
                                                // date.setDate(date.getDate()+1);
                                                let crdate=new Date(Date.now());
                                                crdate.setHours(0,0,0,0);
                                                console.log("cr",crdate)
                                                console.log("date",date);
                                                let diffTime=Math.abs(crdate-date);
                                                console.log("timediff",diffTime)
                                                let diffDays=Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                console.log(diffDays)
                                                console.log("checkdate",(diffDays===1))
                                                // console.log("check",(subUser.amount>=gymFound.monthlyFee))
                                                console.log(subUser.amount)
                                                console.log(gymFound.monthlyFee)
                                               if(diffDays>=1 )
                                               {
                                                   
                                                if(subUser.amount>=gymFound.monthlyFee)
                                                {
                                                    const addCheckIn= new CheckIn({
                                                        user:checkIn.user,
                                                        gym:checkIn.gym
                                                    })
                                                    addCheckIn.save().then(saveCheckIn=>
                                                        {
                                                            if(saveCheckIn)
                                                            {
                                                                return res.json({message:"CheckIn Successfully Done",checkIn:saveCheckIn,success:true}).status(200)
                                                            }
                                                            else
                                                            {
                                                                return res.json({error:{message:"Failed To Save Check In Data",errorCode:500},success:false}).status(400)
                                                            }
                                                        }).catch(err=>
                                                            {
                                                                return res.json({error:{message:"Catch Error While Saving Check In Data",errorCode:500},success:false}).status(400)
                                                            })
                                                }
                                                else
                                                {
                                                   return res.json({error:{message:"You Can't Check IN Against This Gym Against Your Current Subscription",errorCode:500},success:false}).status(400)
                                                } 
                                               }
                                               else{
                                                return res.json({error:{message:"You Already Be CheckIn",errorCode:500},success:false}).status(400)
                                               }
                
                                            }
                                        }).catch(err=>
                                            {
                                                return res.json({error:{message:"Catch Error While Finding User In CheckIn Table",errorCode:500},success:false}).status(400)   
                                            })
                                }
                            }).catch(err=>
                                {
                                 return res.json({error:{message:"Catch Error While Finding User Subscription",errorCode:500},success:false}).status(400)   
                                })
                        }

                    }).catch(err=>
                    {
                      return res.json({error:{message:"Catch Error While Finding Gym Against Id In Gym Table",errorCode:500},success:false}).status(400)
                    })
                }

            }).catch(err=>
                {
                    return res.json({error:{message:"Catch Error While Finding User Against Id In User Table",errorCode:500},success:false}).status(400)
                })
        }
        else
        {
            return res.json({error:{message:"Check In Fields Validations Failed",errorCode:500},success:false}).status(400)
        }

    }).catch(err=>
        {
            if( err.isJoi === true ){
                return res.json({ error: { message: err.message , errorCode: 500} , success: false});
            }else{
                return res.json({ error: {  message: "Catch Error, Validation", errorCode : 500} , success: false}).status( 500 );
            }
        })
})
module.exports=Router;