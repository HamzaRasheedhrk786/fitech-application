const Router=require('express').Router();
const {Service, Gym}=require("../../Models")
const {serviceValidator, serviceUpdateValidator}=require("../../Validation/serviceValidator")
// const {upload} = require("../../storage")();
const myUpload = require("../../Storage/storage").upload;
// getting response of service
Router.get("/record",(req,res)=>
{
    Service.find().then(recordFound=>
        {
            if(recordFound)
            {
                return res.json({message:"Services Record Founded",services:recordFound,success:true}).status(200)
            }
            else
            {
                return res.json({error:{message:"No Record Found",errorCode:500},success:false}).status(400)
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error While Finding Services Record",errorCode:500},success:false}).status(400)
            })
})
// Getting Particular Service Record Against Id
Router.get("/singleRecord",(req,res)=>
{
    const {service} = req.body;
    Service.findOne({_id:service._id}).then(recordFound=>
        {
            if(recordFound)
            {
                return res.json({message:"Services Record Founded",services:recordFound,success:true}).status(200)
            }
            else
            {
                return res.json({error:{message:"No Record Found",errorCode:500},success:false}).status(400)
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error While Finding Services Record",errorCode:500},success:false}).status(400)
            })
})
// Posting Service Request
Router.post("/addService", myUpload.array('Image',1),(req,res)=>
{
    // decalring object for taking data from body
    let service = JSON.parse(req.body.service);
    // const {event}=req.body;
    console.log("Add service Input");
    console.log(service);
    console.log(req.files);
    let url = `/image/${req.files[0].filename}`;
    console.log( url );
    // validating schema of service by joi validator 
    serviceValidator.validateAsync(service).then(validated=>
        {
            if(validated)
            {
                Service.findOne({name:service.name}).then(nameFound=>{
                    if(nameFound)
                    {
                        return res.json({error:{message:"Service Name Already Exist",errorCode:500},success:false}).status(400)
                    }
                    else
                    {
                        const addService= new Service({
                            name:service.name,
                            description:service.description,
                            image:url
                        })
                        addService.save().then(saveRecord=>
                            {
                                if(saveRecord)
                                {
                                    return res.json({message:"Service Record Saved Successfully",service:saveRecord,success:true}).status(200)
                                }
                                else
                                {
                                    return res.json({error:{message:"Failed To Save Service Record",errorCode:500},success:false}).status(400)
                                }

                            }).catch(err=>{
                                return res.json({error:{message:"Catch Error While Saving Service Record",errorCode:500},success:false}).status(400)
                            })
                    }
                }).catch(err=>{
                    return res.json({error:{message:"Catch Error While Finding Service Name", errorCode:500}, success:false}).status(400);
                })

            }
            else
            {
              return res.json({error:{message:"Service Validation Error", errorCode:500}, success:false}).status(400);      
            }

        }).catch(err=>{
            if(err.isJoi===true){
                return res.json({error:{message:err.message, errorCode:500},success:false}).status(400);
            }else{
                return res.json({error:{message:"Catch Error,Service Add Error", errorCode:500}, success:false}).status(400);
            }
        })
})
// Updating Service Record
Router.patch("/updateService",myUpload.array('Image',1),(req,res)=>
{
    let service = JSON.parse(req.body.service);
    // const {event}=req.body;
    // console.log("Add service Input");
    // console.log(service);
    // console.log(req.files);
    let url = `/image/${req.files[0].filename}`;
    // console.log( url );
    serviceUpdateValidator.validateAsync(service).then(validated=>
        {
            if(validated){
                Service.findOne({_id:service._id}).then(findService=>
                    {
                        if(!findService)
                        {
                            return res.json({error:{message:"Service Not Exist Against ID",errorCode:500},success:false}).status(400)
                        }
                        else
                        {
                            Service.findOne({name:service.name}).then(serviceFound=>
                                {
                                    if(serviceFound)
                                    {
                                        return res.json({error:{message:"Service Name Already Exist",errorCode:500},success:false}).status(400)
                                    }
                                    else
                                    {
                                        Service.updateOne({_id:service._id}, {$set:{name:service.name,description:service.description,image:url}})
                                        .then(updateService=>{
                                            if(updateService){
                                                Service.findOne({ _id: service._id })
                                                .then( foundService => {
                                                    return res.json({ msg: "Service Found and Update",  service: foundService, success: true })
                                                } )
                                                .catch( err => {
                                                    return res.json({ error: { message: "Catch Error, Getting Service", errorCode: 500 }, success: false })
                                                    .status( 400 );
                                                } )
                                                // return res.json({message:"Profile Updated", success:true}).status(200)
                                            }
                                            else{
                                                return res.json({error:{message:"Service not Updated", errorCode:500}, success:false}).status(500); 
                                            }
                                        }).catch(err=>{
                                            return res.json({error:{message:err.message, errorCode:500},success:false}).status(500);
                                        }) 
                                    }

                                }).catch(err=>{
                                    console.log(err)
                                return res.json({error:{message:"Catch Error While Finding Service Against ID Updation",errorCode:500},success:false}).status(400)
                            })
                        }

                    }).catch(err=>
                        {
                            console.log(err)
                            return res.json({error:{message:"Catch Error While Finding Service Against Id",errorCode:500},success:false}).status(400)
                        })
            }
            else
            {
                return res.json({error:{message:"Service Validation Error",errorCode:500},success:false}).status(400)
            }

        }).catch(err=>{
            if(err.isJoi===true){
                return res.json({error:{message:err.message, errorCode:500},success:false}).status(400);
            }else{
                return res.json({error:{message:"Catch Error,Service Update Error", errorCode:500}, success:false}).status(400);
            }
        })

})
// Delete Service Request
Router.delete("/delete",(req,res)=>
{
    const {service}=req.body;
    // first check in gym table
    Gym.findOne({services:service._id}).then(serviceExist=>
        {
            if(serviceExist)
            {
                return res.json({error:{message:"You Can't Delete Service Exists In Gym",errorCode:500},success:false}).status(400);
            }
            else
            {
                Service.findOneAndRemove({_id:service._id}).then(foundService=>{
                    if(!foundService)
                    {
                        return res.json({error:{message:"Service Not Found Against Id",errorCode:500},success:false}).status(400);         
                    }
                    else
                    {
                        return res.json({message:"Service Removed Successfully",service:foundService,errorCode:500}).status(400)
                    }

                }).catch(err=>
            {
                return res.json({error:{message:"Catch Error While Finding Service In Service",errorCode:500},success:false}).status(400);
            })
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error While Finding Service In Gym",errorCode:500},success:false}).status(400);
            })
})
module.exports=Router;