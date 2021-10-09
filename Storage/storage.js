const path = require('path');
const crypto = require('crypto');
const {GridFsStorage} = require('multer-gridfs-storage');
const multer = require('multer');
const mongoose = require('mongoose');
//aquring url from CONFIG/dbconfig
let URL = require('../CONFIG/dbConfig').mongodbonline;
let conn = mongoose.connection;
// defining gfs variable for the use of GridFSBucket
let gfs;
//let gridFSBucket;
conn.once('open', ()=>{
   gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName:'uploads'
  });
  // init stream
  //gfs = Grid(conn.db);
  //gfs.collection('uploads')
})

  // defining storage for stream 
  let storage = new GridFsStorage({
      url: URL,
      options:{useUnifiedTopology:true,useNewUrlParser:true},
      file: (req, file) => {
        
        
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'uploads'
            };
          
            // fileFilter,
            resolve(fileInfo);
          });
          // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
          //   return {
          //     bucketName: 'uploads'
          //   };
          // } else {
          //   return "please select jpg jpeg png"
          // }
        });
      }
    });
  // defining variable for uploading 
  let upload = multer({storage});
  module.exports.upload = upload;