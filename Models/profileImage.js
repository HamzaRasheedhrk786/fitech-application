const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    filename: {
        type: String,
    },
    length:{
        type:Number
    },
    chunkSize:{
        type:Number
    }, 
    md5: {
        type: String,
    },
    contentType: {
        type: String,
    },
    uploadDate: {
        type: Date,
        default: Date.now(),
    },
    image:{
        type:String,
        default:null
    }
})
module.exports = mongoose.model('tblProfileImages', ImageSchema);

 