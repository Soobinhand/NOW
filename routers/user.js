var express = require('express')
var router = express.Router()
var path = require('path')

router.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"../public/index.html"))
})
router.get("/signup",function(req,res){
    res.sendFile(path.join(__dirname,"../public/user/signup.html"))
})

router.get("/login",function(req,res){
    res.sendFile(path.join(__dirname,"../public/user/login.html"))
})

module.exports = router