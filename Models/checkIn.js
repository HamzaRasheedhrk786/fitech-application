const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const SchemaCheckIn=new Schema({
    gym:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblgyms'
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblusers'
    },
    status:{
        type:String,
        default:"active"
    },
    checkInDate:{
        type:Date,
        default: Date.now()
    },

    
})


module.exports=mongoose.model('tblcheckIns', SchemaCheckIn);

