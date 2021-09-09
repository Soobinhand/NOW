var express = require('express')
var router = express.Router()
var path = require('path')
///////////////////////////////////////////DB연결공간/////
var mysql = require('mysql')
var mysqlClient = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'1234',
    database:'greenday'
})
mysqlClient.connect()
///////////////////////////////////////////메인페이지/////

router.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"../public/index.html"))
})

///////////////////////////////////////////회원가입/////
router.get("/signup",function(req,res){
    res.sendFile(path.join(__dirname,"../public/user/signup.html"))
})
router.post("/signup",function(req,res){
    
        var name = req.body.signup_name;
        var email = req.body.signup_email;
        var nickname = req.body.signup_nickname;
        var pw = req.body.signup_pw;
        var pwcheck = req.body.signup_pwcheck
        var result = checkReg(pw,pwcheck);
        if(result==1){
            mysqlClient.query('select * from greenday_user where nickname=?',[nickname],function(error,rows){
                if(rows.length > 0){
                    
                    res.send("<script>alert('중복된 아이디입니다.');location.href='/signup';</script>");
                    
                }else{
                    var regData = {
                        name:name,
                        email:email,
                        nickname:nickname,
                        pw:pw
                    }
                    mysqlClient.query('insert into greenday_user(name,email,nickname,pw) values(?,?,?,?)',[name,email,nickname,pw],function(error,rows){
                        if(error){
                            throw error;
                        }
                        res.send("<script>alert('회원가입이 완료되었습니다.');location.href='/login';</script>");

                    })
                    
                }
            })
        }
        else{
            res.send("<script>alert('비밀번호가 틀렸습니다.');location.href='/signup';</script>");
        }
    
})
var checkReg = function (pw,pwcheck) {
    if (pw != pwcheck) {
        return '비밀번호가 다릅니다.';
    } 

    return 1;
}
///////////////////////////////////////////로그인/////

router.get("/login",function(req,res){
    res.sendFile(path.join(__dirname,"../public/user/login.html"))
})

module.exports = router