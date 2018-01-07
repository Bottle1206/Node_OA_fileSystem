var express = require('express');
var	router = express.Router();
var crypto = require('crypto');
var	fileListOperate = require('../models/fileListOperate.js');
var	User = require('../models/user.js');
	
router.get('/', function(req, res) {
	if(req.cookies.islogin_name) {
		req.session.username = req.cookies.islogin_name;
	}
	if(req.session.username) {
		res.locals.username = req.session.username;
	} else {
		res.redirect('/login');
		return;
	}
	res.render('index_admin', {
		title: '管理员页面'
	});
	
});

router.post('/addNewUser', function(req, res) {
	var userName = req.body.username,
		position = req.body.position,
		rank = req.body.rank,
		manager = req.body.manager,
		userPwd = '123456',
		md5 = crypto.createHash('md5');
	userPwd = md5.update(userPwd).digest('hex');

	var newUser = new User({
		username: userName,
		userpass: userPwd,
		position: position,
		manager: manager,
		rank: rank,
		dealpwd: userPwd
	});
	//检查用户名是否已经存在
	User.getUserNumByName(newUser.username, function(err, results) {
		if(results != null && results[0]['num'] > 0) {
			res.end('name_existed');
			return;
		}else{
			newUser.save(function(err, result) {
				if(err) {
					throw err;
				}else{
					res.end('success');
				}
			});
		}
	});
});

router.post('/delUser',function(req,res){
	console.log('over this')
	var id = req.body.id;
	User.delUser(id, function(err,result){
		if(err){
			throw err;
		}else{
			res.end('success');
		}
	})
})

router.post('/getAllUser',function(req,res){
	User.getAllUser(function(err,result){
		res.end(JSON.stringify(result));
	})
})

router.post('/updateUser', function(req, res){
	var user={
		id: req.body.id,
		position: req.body.position,
		rank: req.body.rank,
	}
	if(req.body.manager){
		user.manager = req.body.manager;
	}
	User.updateUser(user, function(err, result){
		if(err){
			throw err;
		}else{
			res.end('success');
		}
	})
})


module.exports = router;