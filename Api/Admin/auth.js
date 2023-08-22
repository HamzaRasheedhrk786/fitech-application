const Router= require("express").Router();
// admin login api
Router.post("/login",(req,res)=>
{
    const {admin}=req.body;
    try{

        if(admin.username==="admin" && admin.password==="admin")
        {
            return res.json({message:"Admin Logged In Successfully",success:true}).status(200)
        }
        else
        {
            return res.json({error:{message:"Admin Login Failed",errorCode:500},success:false}).status(400)
        }
    }
    catch
    {
        return res.json({error:{message:"Catch Error Admin Login Failed",errorCode:500},success:false}).status(400)
    }
})
module.exports=Router;