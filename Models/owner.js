const mongoose=require('mongoose');
const { LOCAL } = require('../Api/constVariables');
const Schema = mongoose.Schema;
const SchemaOwner=new Schema({
    name:{
        type:String,
    },
    email:{
        type:String  
    },
    phoneNo:{
        type:String
    },
    password:{
        type:String,
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
    }

})


SchemaOwner.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        return ret; 
    }
});

module.exports=mongoose.model('tblowners', SchemaOwner);
