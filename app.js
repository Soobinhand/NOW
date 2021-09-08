var express = require('express')
var app = express()
var ejs = require('ejs')
var path = require('path')
var bodyparser = require('body-parser')
var bcrypt = require('bcrypt')
var signup = require('./routers/signup.js')
var login = require('./routers/login')
var logout = require('./routers/logout')
var home = require('./routers/home')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
const connection = require('./config/db_config.js')
app.use(express.static('public'))
app.use(bodyparser.json()) //다음에 찾아와라
app.use(bodyparser.urlencoded({
    extended:true
}))
app.set('view engine', 'ejs')//ejs 세팅
app.listen(8080,function(){
    console.log('server start')
})
app.get("/", function(req,res){
    console.log("complete 1")
    res.sendFile(path.join(__dirname, "./public/index.html"))
})


app.use('/signup',signup)
app.use('/login',login)
app.use('/public',express.static(__dirname+'/public'))
app.use('/logout',logout)
app.use('/home',home)


