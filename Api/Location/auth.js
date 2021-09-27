// const { Router } = require("express");
const Router=require("express").Router();
const {UserLocation, User}=require("../../Models");
// const userPayment = require("../../Models/userPayment");
// require joi validation of model
const {locationValidation}= require("../../Validation/location")
// getting location auth response
Router.get("/user",(req,res)=>{
    const{location}=req.body;
    User.findOne({_id:location.userId}).then(userFound=>{
        if(userFound===null)
        {
            return res.json({error:{message:"User Not Exist In User",errorCode:500},success:false}).status(400)
        }
        else
        {
            UserLocation.findOne({userId:location.userId}).populate("userId","firstName email").then(userLocation=>{
                if(userLocation===null)
                {
                    return res.json({error:{message:"User Location Not Found",errorCode:500},success:false}).status(400)
                }
                else
                {
                    return res.json({message:"User Location Found",userLocation:userLocation,success:true}).status(200)
                }  
            }).catch(err=>{
                return res.json({error:{message:"Catch Error While Finding User Location In User Location",errorCode:500},success:false}).status(400)
            })
        }
    }).catch(err=>{
        return res.json({error:{message:"Catch Error While Finding User In User",errorCode:500},success:false}).status(400)
    })
//    return res.json({message:"Location Is Running",success:true}).status(200)
})
Router.post("/userlocation",(req,res)=>{
    const {location} =req.body;

    locationValidation.validateAsync(location).then(validated=>{
        if(validated)
        {
            UserLocation.findOne({userId:location.userId}).then(findUse=>{
                console.log(findUse)
                if(findUse!==null){
                return res.json({error:{message:"user Already Had Location",errorCode:500},success:false}).status(400);
                }
                else
                {
                    User.findOne({_id:location.userId}).then(findUser=>{
                        // console.log(findUser.address)
                        if(findUser===null){
                            return res.json({error:{message:"user not exits",errorCode:500},success:false}).status(400);
                        }
                        else if(findUser.address===null)
                        {
                            return res.json({error:{message:"user address not exits",errorCode:500},success:false}).status(400);
                        }
                        else{
                            const newLocation= new UserLocation({
                                userId:location.userId,
                                address:findUser.address
                            })
                            // console.log(findUser.address)
                            newLocation.save().then(saveLocation=>{
                                if(saveLocation){
                                    return res.json({message:"location saved",userlocation:saveLocation,success:true}).status(200);
                                }
                                else{
                                    return res.json({error:{message:"Location Failed To Save",errorCode:500},success:false}).status(400);  
                                }
                            }).catch(err=>{
                                return res.json({error:{message:"Catch Error While Saving User Location",errorCode:500},success:false}).status(400);
                            })
                        }
                    }).catch(err=>{
                        console.log(err)
                        return res.json({error:{message:"Catch Error While Finding Userrr",errorCode:500},success:false}).status(400)
                    })
                }
            })
            
            
        }
        else
        {
            return res.json({error:{message:"Validation Error Location",errorCode:500},success:false}).status(400);
        }

    }).catch(err=>{
        if( err.isJoi === true ){
            return res.json({ error: { message: err.message , errorCode: 500} , success: false});
        }else{
            return res.json({ error: {  message: "Catch Error, User LOcation Validation", errorCode : 500} , success: false}).status( 500 );
        }
        // return res.json({error:{message:"Catch Error While While Location Validation",errorCode:500},success:false}).status(400);
    })

})
// update User Location
Router.patch("/updatelocation",(req,res)=>{
    const {location}=req.body;
    User.findOne({_id:location.userId}).then(findUs=>{
        console.log(findUs)
        if(findUs===null){
            return res.json({error:{message:"User Not Exist In User",errorCode:500},success:false}).status(400);
        }
        else
        {
            UserLocation.findOneAndUpdate({userId:location.userId},{$set:{address:findUs.address}}).then(locationUser=>{
                // console.log(findUs.address)
                if(!locationUser)
                {
                    // console.log(locationUser)
                 return res.json({error:{message:"User Location Not Found For Updation",errorCode:500},success:false}).status(400);
                }
                else
                {
                      locationUser.save().then(Updated=>{
                          if(Updated)
                          {
                            return res.json({message:"Location Successfully Updated",userlocation:Updated,success:true}).status(200)
                          }
                          else
                          {
                            return res.json({error:{message:"Location Updation Failed User",errorCode:500},success:false}).status(400);
                          }

                       }).catch(err=>
                        {
                            console.log(err)
                            return res.json({error:{message:"Catch Error While Updating User Location",errorCode:500},success:false}).status(400); 
                        })
                }        
            }).catch(err=>{
                return res.json({error:{message:"Catch Error While Finding Location User",errorCode:500},success:false}).status(400);
            })
        }
    }).catch(err=>
        {
            return res.json({error:{message:"Catch Error While Finding User In User",errorCode:500},success:false}).status(400);
        })
})
module.exports=Router;