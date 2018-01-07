var express = require('express');
var	router = express.Router();
var	fileListOperate = require('../../models/fileListOperate.js');

router.post('/', function(req,res){
	var attr = req.body.attr;	
	var val = req.body.val;
	var id = req.body.id;
	console.log(attr, val , id)
	fileListOperate.changeAttrFile(attr, val, id, function(err,result){
		if(err){
			console.log(err);
			res.end("changeAttr_fail");
		}else{
			res.end("changeAttr_success");
		}
	});
})

module.exports = router;