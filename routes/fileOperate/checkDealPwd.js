var express = require('express');
var	router = express.Router();
var	User = require('../../models/user.js');
var	crypto = require('crypto');

router.post('/', function(req, res) {
	//获取前台数据
	var userName = req.body.username;
	var	dealPwd = req.body.dealPwd;
	var	md5 = crypto.createHash('md5');
	
	User.getUserByUserName(userName, function(err, results) {
		dealPwd = md5.update(dealPwd).digest('hex');//密码加密
		if(results[0].name == userName && results[0].dealpwd == dealPwd) {
			res.end('success');
		}else{
			res.end('error');
		}
	});
});

module.exports = router;