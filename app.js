var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var admin = require('./routes/index_admin');
var staff = require('./routes/index_staff');
var manager = require('./routes/index_manager');
var ceo = require('./routes/index_ceo');
var login = require('./routes/login');
var logout = require('./routes/logout');
var changepwd = require('./routes/changepwd');
var reg = require('./routes/reg');
var setStatusTime = require('./routes/fileOperate/setStatusTime');
var checkDealPwd = require('./routes/fileOperate/checkDealPwd');
var less = require('less');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//穿入一个session Id
app.use(cookieParser("bottle"));
//靠着这个中间件
app.use(session({ secret: 'bottle'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', login)
app.use('/admin', admin);
app.use('/staff', staff);//1
app.use('/manager', manager);//2
app.use('/ceo', ceo);//3
app.use('/login', login);
app.use('/logout', logout);
app.use('/changepwd',changepwd);
app.use('/reg', reg);
app.use('/setStatusTime', setStatusTime);
app.use('/checkDealPwd', checkDealPwd);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if(app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('common/error', { message: err.message, error: err });
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('common/error', { message: err.message, error: {} });
});

var server = app.listen(8008,function(err){
	if(err){
		console.log("配置端口号出错："+err)
	}else{
		var host = server.address().address
		var port = server.address().port
		console.log("应用实例，访问地址为 http://%s:%s", host, port)
		console.log("OA_try1 Server Start!")
	}
})

module.exports = app;