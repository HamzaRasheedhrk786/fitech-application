const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const SchemaOwnerPayment=new Schema({
    owner:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblowners'
    },
    gym:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblgyms'
    },
    image:{
        type:String,
        default:null
    },
    amount:{
        type:Number,
        // required:true
    },
    paymentDate:{
        type:Date,
        default:Date.now()
    }
})
module.exports=mongoose.model('tblownerpayments', SchemaOwnerPayment);