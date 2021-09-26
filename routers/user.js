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
const { ok } = require('assert')
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
    
    
        mysqlClient.query('select * from greenday_bookmark as bookmark join greenday_board as board on bookmark.bookmark_board_id=board.id where bookmark.bookmark_nickname=?',[nickname],function(err,rows){
            
            if(err){
                throw err;
            }
            mysqlClient.query('select * from greenday_post order by post_time desc',function(errors,results){
                    mysqlClient.query('select count(*) as c,post.id, post.title, post.board_title, post.post_time from greenday_post as post join greenday_like as liken on post.id=liken.like_post_id group by post.id having count(*) > 0 order by c desc,post_time desc',function(errors,like){
                        
                        res.render('home.ejs',{nickname:nickname,bookmark_title:rows,atitle:results,like:like})

                    })


            })

    })
    
})



///////////////////////////////////////////게시판/////
router.get("/board",function(req,res){
    mysqlClient.query('select * from greenday_board',function(errors,rows){
        
            res.render('board.ejs',{title:rows,nickname:nickname,sub:rows,board_title:board_title,post_time:rows})
        
        // res.render('board.ejs',{nickname:nickname,title:rows,sub:rows})
    })
    
    
})
///////////////////////////////////////////게시판 검색/////
router.post("/board/search",function(req,res){
    var search_title = "%"+req.body.search_title+"%";
    mysqlClient.query('select * from greenday_board where title like ?',[search_title],function(errors,rows){
        if(rows.length>0){
            mysqlClient.query('select * from greenday_post order by post_time desc',function(errors, results){
            
                res.render('board.ejs',{title:rows,atitle:results,nickname:nickname,sub:rows,board_title:board_title,post_time:rows})

            
            })
        }else{
            res.send("<script>alert('검색 결과 없음.');location.href='/board';</script>");
        }
        
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
    
    mysqlClient.query('select * from greenday_post where board_title=? order by post_time desc',[board_title],function(errors,rows){
            mysqlClient.query('select c.id, count(*) as count from greenday_comment as c join greenday_post as p on c.id = p.id where board_title=? group by c.id order by post_time desc',[board_title],function(error,result){
                res.render('post.ejs',{nickname:nickname,title:rows,board_title:board_title,comment_count:result})
            })
            

    })
    
})
router.post("/delete",function(req,res){
        mysqlClient.query('select * from greenday_post where id=?',[post_id],function(errors,result){
            if(result[0].nickname===nickname){
                mysqlClient.query('delete from greenday_comment where id=?',[post_id],function(errors,rows){
                    mysqlClient.query('delete from greenday_post where id=?',[post_id],function(errors,rows){
                        res.send("<script>alert('게시글이 삭제되었습니다.');location.href='/post';</script>");
                    })
                })
                
            }else{
                res.send("<script>alert('삭제 권한이 없습니다.');location.href='/post/post_title/:id';</script>"); 

            }

        })
        
    
})




router.get("/update",function(req,res){
    mysqlClient.query('select * from greenday_post where id=?',[post_id],function(errors,rows){
        if(rows[0].nickname===nickname){
            res.render('update_post.ejs',{nickname:rows[0].nickname,title:rows[0].title,content:rows[0].content,id:rows[0].id})
        }else{
            res.send("<script>alert('수정 권한이 없습니다.');location.href='/post/post_title/:id';</script>"); 
        }
        
    })
    
})


router.post("/update",function(req,res){
    var update_title = req.body.post_title;
    var update_content = req.body.post_content;
    var post_time = moment().format('YYYY-MM-DD HH:mm:ss');
    mysqlClient.query('update greenday_post set title=?,content=?,post_time=? where id=?',[update_title,update_content,post_time,post_id],function(errors,rows){
        res.send("<script>alert('게시글이 수정되었습니다.');location.href='/post/post_title/:id';</script>");
    })
})
///////////////////////////////////////////해당 게시판의 게시글 쓰기/////
router.get("/newpost",function(req,res){
    res.sendFile(path.join(__dirname,"../public/board/new_post.html"))
})

router.post("/newpost",function(req,res){
    
    var title = req.body.post_title;
    var content = req.body.post_content;
    var post_time = moment().format('YYYY-MM-DD HH:mm:ss');
        

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
    mysqlClient.query('select * from greenday_post where title like ? and board_title=? order by post_time desc',[search_title,board_title],function(errors,rows){
        mysqlClient.query('select c.id, count(*) as count from greenday_comment as c join greenday_post as p on c.id = p.id where board_title=? group by c.id order by post_time desc',[board_title],function(error,result){
            if(rows.length>0){
                res.render('post.ejs',{
                    nickname:nickname,
                    title:rows,
                    board_title:board_title,
                    comment_count:result})
    
            }else{
                res.send("<script>alert('검색 결과 없음.');location.href='/post';</script>");
    
            }
        })

        
    })
})



var post_title;
var post_id;
///////////////////////////////////////////해당 게시글 누르고 들어갔을때. 게시글 보여주기/////
router.post("/post/post_title/:id",function(req,res){
    post_id = req.params.id;
    post_title= req.body.post_title;
    board_title = req.body.board_title;

    res.redirect('/post/post_title/'+post_id)
})

router.get("/post/post_title/:id",function(req,res){
    
    mysqlClient.query('select * from greenday_post where id=?',[post_id],function(errors,rows){
        mysqlClient.query('select * from greenday_comment where id=?',[post_id],function(errors,result){
            mysqlClient.query('select * from greenday_like where like_post_id=?',[post_id],function(error,like){
                res.render('post_title.ejs',{
                    nickname:rows[0].nickname,
                    title:rows[0].title,
                    content:rows[0].content,
                    id:rows[0].id,
                    comment:result,
                    like:like})

            })

        })
        
    })
    
})

///////////////////////////////////////////프로필/////
router.get("/profile",function(req,res){
    mysqlClient.query('select * from greenday_user where nickname = ?',[nickname],function(errors,rows){
        mysqlClient.query('select * from greenday_post where nickname = ?',[nickname],function(error,result){
            res.render('profile.ejs',{profile:rows,post:result});
        })
        
    })
})
router.get("/profile/edit_pw",function(req,res){
    res.render('edit_pw.ejs');
})

router.post("/edit",function(req,res){
    var original_pw = req.body.original_pw;
    var edit_pw = req.body.edit_pw;
    var confirm_pw = req.body.confirm_pw;
    mysqlClient.query('select * from greenday_user where nickname=?',[nickname],function(errors,rows){
        var salt = rows[0].salt;
        var hashpw = crypto.createHash("sha512").update(original_pw+salt).digest("hex");
        if(hashpw===rows[0].pw){
            if(edit_pw===confirm_pw){
                var new_salt = Math.round((new Date().valueOf()*Math.random()))+"";
                var hashpw = crypto.createHash("sha512").update(edit_pw+new_salt).digest("hex");
                mysqlClient.query('update greenday_user set salt=?,pw=? where nickname=?',[new_salt,hashpw,nickname],function(errors,result){
                    res.send("<script>alert('비밀번호 변경이 완료되었습니다. 다시 로그인 해주세요.');location.href='/login';</script>");
                })
            }else{
                res.send("<script>alert('비밀번호가 틀립니다.');location.href='/profile/edit_pw';</script>");
            }
            
        }else{
            res.send("<script>alert('기존 비밀번호와 일치하지 않습니다.');location.href='/profile/edit_pw';</script>");

        }
        
    })
})
var comment;
///////////////////////////////////////////댓글/////
router.post("/comment",function(req,res){
    comment = req.body.comment;
    mysqlClient.query('select * from greenday_board where title=?',[board_title],function(error,result){
        if(error){
            throw error;
        }
        if(result.length>0){
            mysqlClient.query('insert into greenday_comment(id,nickname,comment,board_id) values(?,?,?,?)',[post_id,nickname,comment,result[0].id],function(errors,rows){
                if(errors){
                    throw errors;
                }
                res.redirect('/post/post_title/'+post_id);
            })
        }
        
    })
    
})
router.post("/comment/delete/:id",function(req,res){
    var comment_id = req.params.id;
    mysqlClient.query('select * from greenday_comment where comment_id=?',[comment_id],function(errors,result){
        if(result[0].nickname===nickname){
            mysqlClient.query('delete from greenday_comment where comment_id=? and nickname=?',[comment_id,nickname],function(errors,rows){
        
                res.redirect('/post/post_title/'+post_id);
                
        })
        }else{
            res.send("<script>alert('삭제 권한이 없습니다.');history.go(-1);</script>"); 

        }
    })
    
})


///////////////////////////////////////////북마크/////
router.post('/bookmark',function(req,res){
    mysqlClient.query('select id from greenday_board where title=?',[board_title],function(errors,rows){
        mysqlClient.query('insert into greenday_bookmark(bookmark_nickname,bookmark_board_id) values(?,?)',[nickname,rows[0].id],function(error,result){
            res.send("<script>alert('찜목록에 추가되었습니다.');location.href='/post';</script>"); 

        })
    })
    
})
router.post('/bookmark/delete',function(req,res){
    mysqlClient.query('select id from greenday_board where title=?',[board_title],function(errors,rows){
        mysqlClient.query('delete from greenday_bookmark where bookmark_nickname=? and bookmark_board_id=?',[nickname,rows[0].id],function(error,result){
            res.send("<script>alert('취소');location.href='/post';</script>"); 

        })
    })
    
})
///////////////////////////////////////////좋아요/////
router.post('/like',function(req,res){
    mysqlClient.query('select * from greenday_like where like_nickname=? and like_post_id=?',[nickname,post_id],function(err, like){
        if(like.length>0){
            mysqlClient.query('delete from greenday_like where like_nickname=?',[nickname],function(errors,rows){
                res.redirect('/post/post_title/'+post_id);      
            })
        }else{
            mysqlClient.query('insert into greenday_like(like_nickname,like_post_id) values(?,?)',[nickname,post_id],function(errors,rows){
                res.redirect('/post/post_title/'+post_id);      
              })
        }
    })
       
})



module.exports = router

