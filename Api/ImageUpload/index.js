const Router = require("express").Router();
// const { upload } = require("../../storage")();
const myUpload = require("../../Storage/storage").upload;
const { User, Owner} = require("../../Models");
const { LOCAL } = require("../constVariables");
//Upload Image

Router.patch('/user/:userId', myUpload.array('profileImage', 1), async(req, res) =>{
    // const {originalname}=req.file;
    console.log("Profile Image  Uploading")
    console.log("File Input");
    console.log(req.files);
    const {userId}=req.params;
    console.log("Parmams Input");
    console.log(userId);
    let url = `/image/${req.files[0].filename}`;

    User.findOneAndUpdate({_id:userId},{$set:{image:url}}).then(userFound=>
        {
            if(!userFound)
            {
                return res.json({error:{message:"User Not Exits Against Id",errorCode:500},success:false}).status(400);
            }
            else{
                User.findOne({_id:userId}).then(userUpdated=>
                    {
                        if(!userUpdated)
                        {
                            return res.json({error:{message:"Updated User Not Exits Against Id",errorCode:500},success:false}).status(400);
                        }
                        else
                        {
                            return res.json({message:"User Profile Image Updated",user:userUpdated,success:true}).status(200)
                        }
                    }).catch(err=>
                        {
                            return res.json({error:{message:"Catch Error While Finding Updated User Against Id",errorCode:500},success:false}).status(400)
                        })
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Ctach Error While Finding User Against Id",errorCode:500},success:false}).status(400)
            })
    
    // console.log( url );
    // User.updateOne({ _id: userId }, {
    //     image: url,
    //     accountType:LOCAL
    // }).then( updated => {
    //     console.log( "updated.n" )
    //     console.log( updated.n );
    //     User.findOne({ _id: userId })
    //     .then( foundUser => {
    //         if(updated.n===1){
    //             return res.json({ msg: "User Found and Image Update",  user: foundUser, success: true })
    //         }else{
    //             return res.json({ error: { message: "User Not Found", errorCode: 500 }, success: false }).status( 500 );
    //         }
    //         // return res.json({ msg: "User Found and Image Update",  user: foundUser, success: true })
    //     } )
    //     .catch( err => {
    //         return res.json({ error: { message: "Catch Error, Getting User", errorCode: 500 }, success: false })
    //         .status( 500 );
    //     } )
    // } )
    // .catch( err => {
    //     return res.json({ error: { message: "Catch Error, Updating User", errorCode: 500 }, success: false })
    //     .status( 500 );
    // } )
  
});
// // updating user Image
// Router.patch("user/updateImage/:userId",myUpload.array('profileImage',1),(req,res)=>
// {
//     User.findOne()
// })
Router.post('/owner/:ownerId', myUpload.array('profileImage', 1), async(req, res) =>{
    // const {originalname}=req.file;
    console.log("Profile Image  Uploading")
    console.log("File Input");
    console.log(req.files);
    const {ownerId}=req.params;
    console.log("Parmams Input");
    console.log(ownerId);
    let url = `/image/${req.files[0].filename}`;
    
    console.log( url );
    Owner.updateOne({ _id: ownerId }, {
        image: url,
        accountType:LOCAL
    }).then( updated => {
        console.log( "updated.n" )
        console.log( updated.n );
        Owner.findOne({ _id: ownerId })
        .then( foundOwner => {
            if(updated.n===1){
                return res.json({ msg: "Owner Found and Image Update",  owner: foundOwner, success: true })
            }else{
                return res.json({ error: { message: "Owner Not Found", errorCode: 500 }, success: false }).status( 500 );
            }
            // return res.json({ msg: "User Found and Image Update",  user: foundUser, success: true })
        } )
        .catch( err => {
            console.log(err)
            return res.json({ error: { message: "Catch Error, Getting Owner", errorCode: 500 }, success: false })
            .status( 500 );
        } )
    } )
    .catch( err => {
        return res.json({ error: { message: "Catch Error, Updating Owner", errorCode: 500 }, success: false })
        .status( 500 );
    } )
  
});


module.exports=Router;
