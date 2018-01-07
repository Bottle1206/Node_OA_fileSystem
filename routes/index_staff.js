var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var util = require('util');
var	fileListOperate = require('../models/fileListOperate.js');
var STAFF_UPLOAD_FOLDER;
var Staff_To_Manager;

router.get('/', function(req, res) {
	if(req.cookies.islogin_name) {
		req.session.username = req.cookies.islogin_name;
		req.session.manager = req.cookies.islogin_manager;
		STAFF_UPLOAD_FOLDER = req.cookies.islogin_name;
		Staff_To_Manager = req.cookies.islogin_manager;
		console.log(req.cookies.islogin_manager);
	}
	if(req.session.username) {
		res.locals.username = req.session.username;
		STAFF_UPLOAD_FOLDER = req.session.username;
		Staff_To_Manager = req.session.manager;
		console.log(req.session.manager)
	} else {
		res.redirect('/login');
		return;
	}
	
	//判断该职员的文件夹是否已存在，不存在的创建目录
	fs.readdir("public/avatar", function(err, files) {
		if(err) {
			return console.error(err);
		}
		var IsExit = true;
		files.forEach(function(file) {
			if(file.toString() == STAFF_UPLOAD_FOLDER) {
				IsExit = false;
			}
		});
		if(IsExit) {
			fs.mkdir("public/avatar/" + STAFF_UPLOAD_FOLDER, function(err) {
				if(err) {
					return console.error(err);
				}
				console.log("目录创建成功。");
			});
		}
	});
	res.render('index_staff', {
		title: '主页_员工'
	});
});

router.post('/', function(req, res) {
	var form = new formidable.IncomingForm(); //创建上传表单
	form.encoding = 'utf-8'; //设置编辑
	form.uploadDir = 'public/avatar/' + STAFF_UPLOAD_FOLDER + '/'; //设置上传目录
	form.keepExtensions = true; //保留后缀
	form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

	form.on('fileBegin', function(name, file) {
		var isWord = /.(doc|docx)$/.test(file.name) && file.type.indexOf("application/") == 0;
		if(!isWord){
			res.end("upload_type_fail");
			return;
		}
	});
	
	form.on('file',function(name,file){

	})

	form.parse(req, function(err, fields, files) {
		if(err) {
			console.log(err);
			res.end('upload_fail');
			return;
		}
		var filename = files.fulAvatar.name;
		var isWord = /.(doc|docx)$/.test(filename) && files.fulAvatar.type.indexOf("application/") == 0;
		if(isWord) {
			var newPath = form.uploadDir + filename;
			fs.renameSync(files.fulAvatar.path, newPath); //重命名
			var file = new fileListOperate({
				filename: filename,
				staff: STAFF_UPLOAD_FOLDER,
				manager: Staff_To_Manager,
				title: fields.taskName
			});
			file.addFile(function(err,result){
				if(err) throw err;
				if(result.insertId > 0){
					console.log("添加成功！");
					res.end('upload_success');
				}
			});
		} else {
			res.end("upload_type_fail");
			return;
		}
	});
	
});

router.post('/getMyFile',function(req ,res){
	var staff = req.body.staff;
	fileListOperate.getMyFile(staff,function(err,result){
		if(err){
			console.log("获取职员 "+staff+"的信息失败！");
			return;
		}
		res.end(JSON.stringify(result));
	});
});

router.post('/updateFile',function(req, res){
	fileListOperate.updateFile(req.body,function(err, result){
		if(err){
			console.log("更新失败！")
			return;
		}else{
			res.end("updateFile_success")
		}
	})
});

router.post('/delFile',function(req, res){
	fileListOperate.delFile(req.body.id,function(err,result){
		if(err){
			console.log("删除失败！")
			return;
		}else{
			res.end("delFile_success")
		}
	})
})



module.exports = router;