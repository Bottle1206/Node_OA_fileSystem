var mysql = require('mysql');
var fs= require('fs');
var util = require('util');
var DB_NAME = 'oa';

var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456'
});

pool.on('connection', function(connection) {
	connection.query('SET SESSION auto_increment_increment=1');
});

function getNowTime(){
	function addZero(str){
		str += '';
		if(str.length == 1){
			str = "0"+str;
		}
		return str;
	}
	var time = new Date();
	var month = time.getMonth()+1;
	var now = time.getFullYear() +'-'+ 
	          addZero(month) +'-'+ 
	          addZero(time.getDate()) +' '+ 
	          addZero(time.getHours()) +':'+ 
	          addZero(time.getMinutes());
	return now;
}

function fileOperate(file) {
	this.filename = file.filename;
	this.staff = file.staff;
	this.manager = file.manager;
	this.title = file.title;
};

pool.getConnection(function(err, connection) {
	var useDbSql = "USE " + DB_NAME;
	//选择（连接）数据库
	connection.query(useDbSql, function(err) {
		if(err) {
			console.log("USE Error: " + err.message);
			return;
		}
		console.log('USE succeed');
	});

	//添加一条数据
	fileOperate.prototype.addFile = function(callback) {
		var file = {
			filename: this.filename,
			staff: this.staff,
			manager: this.manager,//待定功能
			title: this.title
		};
		var time = getNowTime();
		var statusTime = [{"status":0, "time":time}];
		statusTime = JSON.stringify(statusTime);
		var insertfile_Sql = "INSERT INTO filelist(id, filename, staff, status, manager, title, statusTime) VALUES(0,?,?,0,?,?,?)";
		//添加数据
		connection.query(insertfile_Sql, [file.filename, file.staff, file.manager, file.title, statusTime], function(err, result) {
			if(err) {
				console.log("addFile Error: " + err.message);
				return;
			}
			console.log("addFile_OK");
			callback(err, result);
		});
	};
	
	//更新数据updateFile
	fileOperate.updateFile = function(param,callback){
		var updateFile_Sql = "UPDATE filelist SET filename = ? AND status = 0 AND statusTime = null WHERE id = ?";
		connection.query(updateFile_Sql, [param.filename, param.id], function(err, result){
			if(err){
				console.log("updateFile Error: "+ err.message);
				return;
			}
			console.log("updateFile_OK");
			callback(err, result)
		})
	}
	

	//获取所有数据
	fileOperate.getAllFiles = function(callback) {
		var getallfile_Sql = "SELECT * FROM filelist";
		connection.query(getallfile_Sql, function(err, result) {
			if(err) {
				console.log("getAllFiles Error: " + err.message);
				return;
			}
			console.log("getAllFiles_OK");
			callback(err, result);
		});
	};
	
	//删除无效的文件
	fileOperate.delFile = function(id,callback){
		var getFile_Sql = 'SELECT * FROM filelist WHERE id='+id;
		connection.query(getFile_Sql,function(err,res){
			if(err) {
				console.log("delFile_1_getFile Error: " + err.message);
				return;
			}else{
				console.log("delFile_1_getFile_OK");
				var filename = res[0].filename;
				var staff = res[0].staff;
				var path = new Buffer('public/avatar/'+staff+'/'+filename,'utf8');
				fs.unlink(path,function(err){
					if(err){
						console.log("delFile_2_delRealFile_Error");
						throw err;
					}
					console.log("delFile_2_delRealFile_OK");
					var delfile_Sql = 'DELETE FROM filelist WHERE id ='+id;
					connection.query(delfile_Sql,function(err,result){
						if(err) {
							console.log("delFile_3_delDataFile Error: " + err.message);
							throw err;
						}
						console.log("delFile_3_delDataFile_OK");
						callback(err, result);
					})
				})
			}
		})
		
	}
	
	//对职员getToStaff
	fileOperate.getMyFile = function(staff,callback){
		var getmyfile_Sql = "SELECT * FROM filelist WHERE staff = ?";
		connection.query(getmyfile_Sql, [staff], function(err,result){
			if(err){
				console.log("getMyFile Error: "+ err.message);
				return;
			}
			console.log("getMyFile_OK");
			callback(err,result);
		})
	}
	
	//对经理
	fileOperate.getToManagerFile = function(manager,callback){
		var getToManagerFile_Sql = "SELECT * FROM filelist WHERE manager = ?";
		connection.query(getToManagerFile_Sql, [manager], function(err,result){
			if(err){
				console.log("getToManagerFile Error: "+ err.message);
				return;
			}
			console.log("getToManagerFile_OK");
			callback(err, result);
		})
	}
	
	//对ceo
	fileOperate.getToCeoFile = function(callback){
		connection.query("SELECT * FROM filelist WHERE status >= 21", function(err, result){
			if(err) {
				console.log("getToCeoFile Error: " + err.message);
				return;
			}else{
				console.log("getToCeoFile_OK!");
				callback(err, result);
			}
		})
	}
	
	fileOperate.changeAttrFile = function(attr, val, id, callback){
		var setstatus_Sql = "UPDATE filelist SET "+ attr +" = ? WHERE id = ?";
		connection.query(setstatus_Sql, [val, id], function(err, result) {
			if(err) {
				console.log("changeAttrFile Error: " + err.message);
				return;
			}else{
				console.log("changeAttrFile_OK!");
				callback(err, result);
			}
		});
	}
	
	fileOperate.setStatusTime = function(id, newState, calllback){
		newState.time = getNowTime();
		var getStatusTime_Sql = "SELECT statusTime FROM filelist WHERE id = " + id;
		connection.query(getStatusTime_Sql,function(err, nowStatusTime){
			if(err){
				console.log("getStatusTime_Error: "+ err.message);
				return;
			}else{
				nowStatusTime = nowStatusTime[0].statusTime;
				var newStatusTime = JSON.parse(nowStatusTime);
				newStatusTime.push(newState);
				newStatusTime = JSON.stringify(newStatusTime);
				var setStatusTime_Sql = "UPDATE filelist SET statusTime = ? WHERE id = ?";
				connection.query(setStatusTime_Sql,[newStatusTime, id],function(err,result){
					if(err) throw err;
					console.log('setStatusTime_OK!');
					calllback(err, result);
				})
			}
		})
	
	}
	
	fileOperate.setStatusFlag = function(param,callback){
		var setStatusFlag_Sql = "UPDATE filelist SET status = ? WHERE id = ? ";
		connection.query(setStatusFlag_Sql, [param.status, param.id], function(err,result){
			if(err) throw err;
			console.log("setStatusFlag_OK!");
			callback(err, result);
		})
	};
	
	
});

module.exports = fileOperate;