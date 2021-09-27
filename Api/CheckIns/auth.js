const Router= require("express").Router();
const {Gym, User}=require("../../Models")
const {addCheckInValidation}=require("../../Validation/checkInValidator")

// getting response of checkIn server
Router.get("/",(req,res)=>
{
    return res.json({message:"Check In Server Runinng"})
})
module.exports=Router;