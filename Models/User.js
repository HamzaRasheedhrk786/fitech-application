const mongoose=require('mongoose');
const { LOCAL } = require('../Api/constVariables');
// const geocoder= require("../Api/Location/geocoder")
const Schema = mongoose.Schema;
const SchemaUser=new Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        
    },
    password:{
        type:String,
    },
    phoneNumber:{
        type:String,
       
    },
    address:{
        type:String,
    },
    // location: {
    //     type: {
    //       type: String, // Don't do `{ location: { type: String } }`
    //       enum: ['Point'], // 'location.type' must be 'Point'
    //     },
    //     coordinates: {
    //       type: [Number],
    //       index:"2dsphere"
    //     },
    //     formattedAddress:String
    // },
    image: {
        type: String,
        default:"/image/5bb3947438da51ead54ffce9e1823c7a.jpg"
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    verificationCode:{
        type:String,
    },
    emailVerify:{
        type:Boolean,
        default:false
    },
    accountType:{
        type:String,
        default:LOCAL
    },
    userID:{
        type:String,
        default:"T-001"
    },
    dateOfBirth:{
        type:Date,
    },
    country:{
        type:String
    },
    city:{
        type:String
    },
    province:{
        type:String
    },
    houseNo:{
        type:String
    },
    streetName:{
        type:String
    },
  

})


SchemaUser.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        return ret; 
    }
});
// geocoder save location
// SchemaUser.pre("save", async function(next){
//     const loc= await geocoder.geocode(this.address);
//     // console.log(loc)
//     this.location={
//         type:"Point",
//         coordinates:[loc[0].longitude,loc[0].latitude],
//         formattedAddress:loc[0].formattedAddress
//     }
//     this.address=undefined;
//     next();
// })
module.exports=mongoose.model('tblusers', SchemaUser);
