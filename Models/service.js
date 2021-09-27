const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const SchemaService=new Schema({
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
    }
   
})
module.exports=mongoose.model('tblservices', SchemaService);