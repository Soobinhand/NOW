var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var bodyparser = require('body-parser')
app.use(express.static('public'))
app.use(bodyparser.json()) //다음에 찾아와라
app.use(bodyparser.urlencoded({
    extended:true
}))
app.set('view engine', 'ejs')//ejs 세팅
app.listen(3030,function(){
    console.log('server start')
})
app.get("/", function(req,res){
    console.log("complete 1")
    res.sendFile(path.join(__dirname, "./public/index.html"))
})
app.post("/signup", function(req,res){
    var name = req.body.signup_name
    var email = req.body.signup_email
    var id = req.body.signup_id
    var pw = req.body.signup_pw
    var query = connection.query('insert into greenday_user(name,email,id,pw) values ("' + name + '","' + email + '","' + id + '","'+pw+'")',
                function(error,rows){
                    if(error){
                        throw error;
                    }
                    console.log("data insert");
                })
                res.redirect('/')
})

const mysql = require('mysql');  // mysql 모듈 로드
const alert = require('alert'); //alert 
var connection = mysql.createConnection(
    {  // mysql 접속 설정
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '1234',
        database: 'greenday'
    }
); // DB 커넥션 생성
connection.connect();   // DB 접속

app.post("/login",function(req,res){
    var id = req.body.login_id
    var pw = req.body.login_pw
    
    var query = connection.query('SELECT * FROM greenday_user WHERE id = ? AND pw = ?', [id, pw],
                function (error,rows) {
                    console.log(rows[0].name)
                    if(rows[0]){
                        console.log("login success");
                        res.render('home.ejs',{'name':rows[0].name})

                    }
                    else{
                        console.log("login fail")
                        alert('아이디 혹은 비밀번호가 틀립니다.')
                        res.redirect("/")
                    }
                    if(error){
                        throw error;
                    }
                    
                })
})


