const express = require('express');
const app = express();
const mongoose = require('mongoose');
// aquiring url from config
const url = require("./CONFIG/dbConfig").mongodbonline;
// middleware for
app.use(express.json());
app.use(express.urlencoded({extended:true,useNewUrlParser:true}))
// connnection with mongoose
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})
.then(m=>{
    console.log("Database Is Connected");
    // aquiring routs
   app.use("/auth",require("./Routs/auth"));
   // aquring routes of image from routs folder=>uploadImage.js
   app.use('/auth', require('./Routs/imageUpload'));
   //aquirnig files
   app.use('/',require('./Files/getImageFile'));
   // getting server response
   app.get("/",(req,res)=>{
       return res.json({message:"Server Is Running",success:true}).status(200);
   })
}).catch(err=>
    {
        console.log(err)
        // return res.json({error:{message:"Ctach Error Database",errorCode:500},success:false}).status(400)
    })
// defining port using env variable
const Port = process.env.PORT || 5000;
app.listen(Port, () => {
    console.log(`App Is Listening At Port ${Port}`);
})