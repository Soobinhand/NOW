var express = require('express')
var router = express.Router()
var path = require('path')
var crypto = require('crypto')
var cookieParser = require('cookie-parser')
var now_session = require('express-session')
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

///////////////////////////////////////////세션 및 쿠키/////
router.use(now_session({
    secret: 'my key',           
    resave: true,
    saveUninitialized:true
}));
router.use(cookieParser())
///////////////////////////////////////////nickname 처리/////
var  nickname;
var title;
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
        var salt = Math.round((new Date().valueOf()*Math.random()))+"";
        var hashpw = crypto.createHash("sha512").update(pw+salt).digest("hex");
        var pwcheck = req.body.signup_pwcheck
        var result = checkReg(pw,pwcheck);
        if(result==1){
            mysqlClient.query('select * from greenday_user where nickname=?',[nickname],function(error,rows){
                if(rows.length > 0){
                    
                    res.send("<script>alert('중복된 아이디입니다.');location.href='/signup';</script>");
                    
                }else{
                    mysqlClient.query('insert into greenday_user(name,email,nickname,pw,salt) values(?,?,?,?,?)',[name,email,nickname,hashpw,salt],function(error,rows){
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

router.post("/login",function(req,res){
    
    nickname = req.body.login_nickname
    
    var pw = req.body.login_pw
    mysqlClient.query('select * from greenday_user where nickname=?',[nickname],function(errors,rows){
        if (errors) {
            throw errors;
        }
        if(rows[0]){
            var salt = rows[0].salt;
            var hashpw = crypto.createHash("sha512").update(pw+salt).digest("hex");
            if (hashpw==rows[0].pw) {
                res.redirect('/home')
            }else{
                res.send("<script>alert('비밀번호가 틀렸습니다.');location.href='/login';</script>");
            }
        }else{
            res.send("<script>alert('등록된 아이디가 없습니다.');location.href='/login';</script>");

        }
        
    })
})
///////////////////////////////////////////로그인 후 home 으로 경로 변경/////

router.get("/home",function(req,res){
    res.render('home.ejs',{nickname:nickname})
})


///////////////////////////////////////////게시판/////
router.get("/board",function(req,res){
    mysqlClient.query('select * from greenday_board',function(errors,rows){
        res.render('board.ejs',{nickname:nickname,title:rows,sub:rows})
        
    })
    
})
///////////////////////////////////////////게시판 검색/////
router.post("/board/search",function(req,res){
    var search_title = "%"+req.body.search_title+"%";
    mysqlClient.query('select * from greenday_board where title like ?',[search_title],function(errors,rows){
        res.render('board.ejs',{nickname:nickname,title:rows,sub:rows})
    })
})
///////////////////////////////////////////게시판 만들기/////
router.get("/newboard",function(req,res){
    res.sendFile(path.join(__dirname,"../public/board/new_board.html"))
})

router.post("/newboard",function(req,res){
    
    title = req.body.new_board_title;
    var sub = req.body.new_board_sub;
    mysqlClient.query('select * from greenday_board where title=?',[title],function(errors,rows){
        if(errors) throw errors;
        if(rows[0]){
            res.send("<script>alert('중복된 이름의 게시판이 이미 존재합니다.');location.href='/newboard';</script>");
        }else{
            mysqlClient.query('insert into greenday_board(title, sub) values(?,?)',[title,sub],function(errors,rows){
                if (errors) {
                    throw errors;
                }
                
                res.send("<script>alert('게시판 등록이 완료되었습니다.');location.href='/board';</script>");
                
            })
        }
    })
    
})
var board_title
///////////////////////////////////////////해당 게시판의 게시글/////
router.post("/post",function(req,res){
    board_title = req.body.post_title;
    res.redirect('/post')
})
router.get("/post",function(req,res){
    mysqlClient.query('select * from greenday_post where board_title=?',[board_title],function(errors,rows){
        res.render('post.ejs',{nickname:nickname,title:rows,board_title:board_title})
        
    })
    
})
var post_time = moment().format('YYYY-MM-DD HH:mm:ss');

///////////////////////////////////////////해당 게시판의 게시글 쓰기/////
router.get("/newpost",function(req,res){
    res.sendFile(path.join(__dirname,"../public/board/new_post.html"))
})

router.post("/newpost",function(req,res){
    
    var title = req.body.post_title;
    var content = req.body.post_content;

        

            mysqlClient.query('insert into greenday_post(title, content,nickname,board_title,post_time) values(?,?,?,?,?)',[title,content,nickname,board_title,post_time],function(errors,rows){
                if (errors) {
                    throw errors;
                }
                
                res.send("<script>alert('게시글 등록이 완료되었습니다.');location.href='/post';</script>");
                
            })
        
    
    
})
///////////////////////////////////////////해당 게시판의 게시글 검색창/////
router.post("/post/search",function(req,res){
    var search_title = "%"+req.body.search_title+"%";
    mysqlClient.query('select * from greenday_post where title like ?',[search_title],function(errors,rows){
        
        res.render('post.ejs',{nickname:nickname,title:rows,board_title:board_title})
    })
})
var post_title;
///////////////////////////////////////////해당 게시글 누르고 들어갔을때. 게시글 보여주기/////
router.post("/post/post_title",function(req,res){
    
    post_title= req.body.post_title;
    

    res.redirect('/post/post_title')
})

router.get("/post/post_title",function(req,res){
    mysqlClient.query('select * from greenday_post where title=?',[post_title],function(errors,rows){
        res.render('post_title.ejs',{nickname:nickname,title:rows[0].title,content:rows[0].content})
        
    })
    
})
module.exports = router

