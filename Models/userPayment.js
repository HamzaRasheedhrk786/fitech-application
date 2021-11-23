const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const SchemaUserPayment=new Schema({
    image:{
        type:String,
        default:null
    },
    amount:{
        type:Number,
        // required:true
    },
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblusers'
    },
    subscriptionId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblsubscriptions'
    },
    status:{
        type:String,
        default:"pending"
    },
    paymentDate:{
        type:Date,
        default:Date.now()
    }
})
module.exports=mongoose.model('tbluserpayments', SchemaUserPayment);