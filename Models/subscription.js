const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const SchemaSubscription=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    image:{
        type:String,
        default:null
    },
    amount:{
        type:Number,
        required:true
    },
    userId:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblusers'
    }],
})
module.exports=mongoose.model('tblsubscriptions', SchemaSubscription);