var express = require('express');
var	router = express.Router();
var	fileListOperate = require('../models/fileListOperate.js');
	
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
	res.render('index_manager', {
		title: '主页_经理'
	});
	
});

router.post('/setStatusFlag', function(req, res){
	fileListOperate.setStatusFlag(req.body, function(err,result){
		if(err){
			console.log("setStatusFlag错误！");
			return false;
		}
		res.end("setStatusFlag_success!");
	})
})

router.post('/getToManagerFiles',function(req,res){
	var manager = req.body.manager;
	fileListOperate.getToManagerFile(manager, function(err,result){
		if(err){
			console.log("获取递交给"+manager+"的信息失败！");
			return false;
		}
		res.end(JSON.stringify(result));
	});
})

module.exports = router;