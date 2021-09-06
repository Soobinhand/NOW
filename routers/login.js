var express = require('express')
var router = express.Router()
var db = require('../config/db_config')
var name;
router.get('/success',function(req,res){
    res.render('home.ejs',{name:name})
})

router.post("/",function(req,res){
    var id = req.body.login_id
    var pw = req.body.login_pw
    var query = db.query('SELECT * FROM greenday_user WHERE id = ? AND pw = ?', [id, pw],
                function (error,rows) {
                    
                    if(rows[0]){
                        name = rows[0].name
                        console.log("login success");
                        res.redirect("/login/success")

                    }
                    else{
                        console.log("login fail")
                        res.redirect("/")
                    }
                    if(error){
                        throw error;
                    }
                    
                })
})

module.exports = router