const Router = require('express').Router();
const mongoose = require('mongoose');
// connection with mongoose
let conn = mongoose.connection;
// let tbluploads = require('../../models/imgupload')
// defining gfs variable for the use of GridFSBucket
let gfs;
gfs = new mongoose.mongo.GridFSBucket(conn.db, {
bucketName:'uploads'
  });
  // getting image against filename /image/:filename
  Router.get('/image/:filename',(req,res) => { 
    gfs.find({filename:req.params.filename})
    .toArray((err,file) =>{
      if(!file || file.length === 0){ 
       return res.json({error:{message:"Error No Image File Exist",errorCode:500},success:false}).status(400);
      }else{  
          //read output to browser
         let readImage = gfs.openDownloadStreamByName(req.params.filename);
         readImage.pipe(res);
      }
    })
   })
  


module.exports =Router;