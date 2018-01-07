var express = require('express'),
	router = express.Router();

router.get('/', function(req, res) {
	//清除cookies
	res.clearCookie('islogin_name');
	//清除session
	req.session.destroy();
	res.redirect('/login');
});

module.exports = router;