var express = require('express')
var app = express()
var ejs = require('ejs')
var path = require('path')
var bodyparser = require('body-parser')
app.use(express.static('public'))
app.use(bodyparser.json()) //다음에 찾아와라
app.use(bodyparser.urlencoded({
    extended:true
}))
app.set('view engine', 'ejs')//ejs 세팅
app.listen(8080,function(){
    console.log('server start')
})
///////////////////////////////////////////--/////
var mysql = require('mysql')

var mysqlClient = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'1234',
    database:'greenday'
})

mysqlClient.connect()

///////////////////////////////////////////--/////
var user = require('./routers/user')
app.use('/',user)
///////////////////////////////////////////--/////
