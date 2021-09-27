const mongoose=require('mongoose');
const geocoder= require("../Api/Location/geocoder")
const { LOCAL } = require('../Api/constVariables');
const Schema = mongoose.Schema;
const SchemaUserLocation=new Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblusers'
    },
    address:{
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
    }

    
})
// geocoder save location
SchemaUserLocation.pre("save", async function(next){
    const loc= await geocoder.geocode(this.address);
    // console.log(loc)
    this.location={
        type:"Point",
        coordinates:[loc[0].longitude,loc[0].latitude],
        formattedAddress:loc[0].formattedAddress
    }
    this.address=undefined;
    next();
})
// SchemaUserLocation.post("save", async function(next){
//     const loc= await geocoder.geocode(this.address);
//     console.log(loc)
//     this.location={
//         type:"Point",
//         coordinates:[loc[0].longitude,loc[0].latitude],
//         formattedAddress:loc[0].formattedAddress
//     }
//     this.address=undefined;
//     next();
// })
module.exports=mongoose.model('tbluserlocations', SchemaUserLocation);

