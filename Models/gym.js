const mongoose=require('mongoose');
const geocoder= require("../Api/Location/geocoder")
const { LOCAL } = require('../Api/constVariables');
const Schema = mongoose.Schema;
const SchemaGym=new Schema({
    images:
    [{
      type:String,
      required:true
    }],
    ownerId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblowners'
    },
    name:
    {
        type:String
    },
    city:
    {
        type:String
    },
    contactNumber:
    {
        type:String
    },
    monthlyFee:{
        type:Number
    },
    gymAddress:{
        type:String
    },
    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
          type: [Number],
          index:"2dsphere"
        },
        formattedAddress:String
    },
    services:[
        {
            type:mongoose.SchemaTypes.ObjectId,
            ref:'tblservices' 
        }
    ],
    status:{
        type:String,
        default:"inactive"
    },   
    createdAt:{
        type:Date,
        default: Date.now()
    },

    
})
// geocoder save location
SchemaGym.pre("save", async function(next){
    const loc= await geocoder.geocode(this.gymAddress);
    // console.log(loc)
    this.location={
        type:"Point",
        coordinates:[loc[0].longitude,loc[0].latitude],
        formattedAddress:loc[0].formattedAddress
    }
    this.gymAddress=undefined;
    next();
})

module.exports=mongoose.model('tblgyms', SchemaGym);

