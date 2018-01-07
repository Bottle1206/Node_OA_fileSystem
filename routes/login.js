var express = require('express');
var	router = express.Router();
var	User = require('../models/user.js');
var	crypto = require('crypto');

router.get('/', function(req, res) {
	res.render('login');
});

router.post('/', function(req, res) {
	//获取前台数据
	var userName = req.body.username;
	var	userPwd = req.body.password;
	var	isRem = req.body.chbRem;//记住密码
	var	md5 = crypto.createHash('md5');
	
	User.getUserByUserName(userName, function(err, results) {
		var transferObj={};
		if(results == '' || results == null) {
			transferObj.msg = "no_account";
		}else{
			userPwd = md5.update(userPwd).digest('hex');//密码加密
			if(results[0].name != userName || results[0].password != userPwd) {
				transferObj.msg = "account_pwd_error";
			} else {
				if(isRem == "true"){
					res.cookie('islogin_name', userName);
					res.cookie('islogin_rank', results[0].rank);
					res.cookie('islogin_manager', results[0].manager);
				}else{
					res.cookie('islogin_name', userName, { maxAge: 60000 });//cookies定时器60秒过期
					res.cookie('islogin_rank', results[0].rank, { maxAge: 60000 });
					res.cookie('islogin_manager', results[0].manager, { maxAge: 60000 });
				}
				req.session.username = res.locals.username;
				req.session.rank = res.locals.rank;
				req.session.manager = res.locals.manager;
				transferObj = {
					msg: "success",
					name: userName,
					rank: results[0].rank,
					position: results[0].position
				}
			}
		}
		res.end(JSON.stringify(transferObj));
	});
});

module.exports = router;