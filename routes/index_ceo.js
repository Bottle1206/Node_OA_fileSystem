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
	res.render('index_ceo', {
		title: '主页_CEO'
	});
});


router.post('/getToCeoFiles',function(req,res){
	fileListOperate.getToCeoFile(function(err,result){
		if(err){
			console.log(err);
			return;
		}else{
			res.end(JSON.stringify(result));
		}
	})
})


module.exports = router;