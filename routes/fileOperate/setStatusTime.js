var express = require('express');
var	router = express.Router();
var util = require('util');
var	fileListOperate = require('../../models/fileListOperate.js');

router.post('/', function(req,res){
	var param = req.body;
	var id = param.id;
	var newStatus = {
		"status": param.status
	};
	if(param.managerTip){
		newStatus.managerTip = param.managerTip;
	}else if(param.ceoTip){
		newStatus.ceoTip = param.ceoTip;
	}
	fileListOperate.setStatusTime(id, newStatus, function(err,result){
		if(err){
			console.log(err);
			res.end("setStatusTime_fail");
		}else{
			res.end("setStatusTime_success");
		}
	});
})

module.exports = router;