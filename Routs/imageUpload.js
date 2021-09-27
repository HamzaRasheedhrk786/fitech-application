const Router = require("express").Router();

Router.use( "/", require("../Api/ImageUpload") );



module.exports = Router;