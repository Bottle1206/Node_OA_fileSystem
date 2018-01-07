var mysql = require('mysql');
var DB_NAME = 'oa';

var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456'
});

pool.on('connection', function(connection) {
	connection.query('SET SESSION auto_increment_increment=1');
});

function User(user) {
	this.username = user.username;
	this.userpass = user.userpass;
	this.position = user.position;
	this.rank = user.rank;
	this.manager = user.manager;
	this.dealpwd = user.dealpwd;
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

	//保存数据
	User.prototype.save = function(callback) {
		var user = {
			username: this.username,
			userpass: this.userpass,
			position: this.position,
			rank: this.rank,
			manager: this.manager,
			dealpwd: this.dealpwd
		};
		var insertUser_Sql = "INSERT INTO userinfo2(id,name,password,position,rank,manager,dealpwd) VALUES(0,?,?,?,?,?,?)";
		//添加数据
		connection.query(insertUser_Sql, [user.username, user.userpass, user.position, user.rank, user.manager, user.dealpwd], function(err, result) {
			if(err) {
				console.log("insertUser_Sql Error: " + err.message);
				return;
			}
			callback(err, result);
		});
	};
	
	User.getAllUser = function(callback){
		var getAllUser_Sql = "SELECT * FROM userinfo2 WHERE rank!=0";
		connection.query(getAllUser_Sql, function(err,result){
			if(err){
				console.log("getAllUser Error: "+ err.message);
				return;
			}
			callback(err, result);
		})
	}

	//根据用户名得到用户数量
	User.getUserNumByName = function(username, callback) {
		var getUserNumByName_Sql = "SELECT COUNT(1) AS num FROM userinfo2 WHERE name = ?";
		connection.query(getUserNumByName_Sql, [username], function(err, result) {
			if(err) {
				console.log("getUserNumByName Error: " + err.message);
				return;
			}
			callback(err, result);
		});
	};

	//根据用户名得到用户信息
	User.getUserByUserName = function(username, callback) {
		var getUserByUserName_Sql = "SELECT * FROM userinfo2 WHERE name = ?";
		connection.query(getUserByUserName_Sql, [username], function(err, result) {
			if(err) {
				console.log("getUserByUserName Error: " + err.message);
				return;
			}
			callback(err, result);
		});
	};
	
	//修改密码
	User.setNewPwd = function(userName, newpwd, callback){
		var setNewPwd_Sql = 'UPDATE userinfo2 SET password = ? WHERE name = ?';
		connection.query(setNewPwd_Sql, [newpwd,userName], function(err, result){
			if(err) {
				console.log("setNewPwd Error: " + err.message);
				return;
			}
			callback(err, result);
		})
	}
	
	//修改deal密码
	User.setNewDealPwd = function(userName, newpwd, callback){
		var setNewDealPwd_Sql = 'UPDATE userinfo2 SET dealpwd = ? WHERE name = ?';
		connection.query(setNewDealPwd_Sql, [newpwd,userName], function(err, result){
			if(err) {
				console.log("setNewDealPwd Error: " + err.message);
				return;
			}
			callback(err, result);
		})
	}
	
	//删除用户
	User.delUser = function(id, callback){
		var delUser_Sql = 'DELETE FROM userinfo2 WHERE id ='+id;
		connection.query(delUser_Sql, function(err,result){
			if(err) {
				console.log("delUser Error: " + err.message);
				return;
			}
			callback(err, result);
		})
	}
	
	User.updateUser = function(user,callback){
		var setNewPwd_Sql = 'UPDATE userinfo2 SET position = ? ,rank = ?, manager = ? WHERE id ='+ user.id;
		connection.query(setNewPwd_Sql, [user.position, user.rank, user.manager], function(err, result){
			if(err) {
				console.log("updateUser Error: " + err.message);
				return;
			}
			callback(err, result);
		})
	}

});

module.exports = User;