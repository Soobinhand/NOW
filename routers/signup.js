var express = require('express')
var router = express.Router()
var db = require('../config/db_config')


router.post("/", function(req,res){
    var name = req.body.signup_name
    var email = req.body.signup_email
    var id = req.body.signup_id
    var pw = req.body.signup_pw
    
    var query = db.query('insert into greenday_user(name,email,id,pw) values ("' + name + '","' + email + '","' + id + '","'+pw+'")',
                function(error,rows){
                    if(error){
                        throw error;
                    }
                    console.log("data insert");
                })
                res.redirect('/')
})

module.exports = router