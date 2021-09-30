// const Router = require('express').Router();
// // qruring user module
// Router.use("/user",require("../API/User/auth"))
// // qruring admin module
// Router.use("/admin",require("../API/Admin/auth"))
const Router=require("express").Router();

Router.use('/user', require("../Api/User/auth"));
Router.use("/subscription",require("../Api/Subscription/auth"))
Router.use('/imageUpload', require('../Api/ImageUpload/index'));
// Router.use('/imageUpload', require('../Api/ImageUpload/index'));
Router.use('/owner', require("../Api/GymOwner/auth"));
Router.use("/userpayment",require("../Api/UserPayment/auth"))
// for location storage
Router.use("/location",require("../Api/Location/auth"))
// routs for for services
Router.use("/service",require("../Api/Services/auth"))
// gym rout
Router.use("/gym",require("../Api/Gym/auth"))
// check in
Router.use("/checkIn",require("../Api/CheckIns/auth"))

// module.exports=Router;
module.exports =Router;