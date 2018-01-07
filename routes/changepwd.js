var express = require('express');
var	router = express.Router();
var	User = require('../models/user.js');
var	crypto = require('crypto');

router.get('/', function(req, res) {
	res.render('changePwd');
});

router.post('/', function(req, res) {
	//获取前台数据
	var userName = req.body.username;
	var	oldpwd = req.body.oldpwd;
	var	newpwd = req.body.newpwd;
	var	md5 = crypto.createHash('md5');
	var md5_1 = crypto.createHash('md5');
	
	User.getUserByUserName(userName, function(err, results) {
		oldpwd = md5.update(oldpwd).digest('hex');//密码加密
		if(results[0].name == userName && results[0].password == oldpwd) {
			newpwd = md5_1.update(newpwd).digest('hex');//密码加密
			User.setNewPwd(userName,newpwd,function(err, results2){
				if(err){
					throw err;
				}else{
					res.end('success');
				}
			})
		}else{
			res.end('oldpwd_error');
		}
	});
});

router.post('/dealPwd',function(req, res){
		//获取前台数据
	var userName = req.body.username;
	var	oldpwd = req.body.oldDealPwd;
	var	newpwd = req.body.newDealPwd;
	var	md5 = crypto.createHash('md5');
	var md5_1 = crypto.createHash('md5');
	
	User.getUserByUserName(userName, function(err, results) {
		oldpwd = md5.update(oldpwd).digest('hex');//密码加密
		if(results[0].name == userName && results[0].dealpwd == oldpwd) {
			newpwd = md5_1.update(newpwd).digest('hex');//密码加密
			User.setNewDealPwd(userName,newpwd,function(err, results2){
				if(err){
					throw err;
				}else{
					res.end('success');
				}
			})
		}else{
			res.end('oldpwd_error');
		}
	});
})

module.exports = router;