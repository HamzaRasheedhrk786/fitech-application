const User = require('./User');
const Owner = require('./owner');
const ProfileImage=require('./profileImage')
const Subscription=require("./subscription")
const UserPayment=require("./userPayment")
const UserLocation=require("./location")
const Service=require("./service")
const Gym=require("./gym")
const CheckIn=require("./checkIn")
module.exports = {
   
    User,
    ProfileImage,
    Subscription,
    Owner,
    UserPayment,
    UserLocation,
    Service,
    Gym,
    CheckIn
}
