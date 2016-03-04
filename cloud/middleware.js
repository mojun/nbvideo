
var pkg = null;


var _ = require('underscore');

exports.setPKG = function(p) {
	pkg = p;
};

exports.initLocals = function(req, res, next) {
    var locals = res.locals;

    locals.navLinks = [
    	{ label: '首页',  key: 'home', href: '/'},
    	{ label: '用户',  key: 'users', href: '/admin/page/users'},
    	{ label: '分类', key: 'category', href: '/admin/page/categoryList'},
    	{ label: '视频',  key: 'video', href: '/video/list'},
    	{ label: '推送', key: 'push', href: '/admin/page/push'}
    ];

    locals.pkg = pkg;

    next();
};

exports.sessionLocals = function(req, res, next) {
	var session = req.session;
	var locals = res.locals;
	locals.user = session.user;

	next();
};

exports.flashMessages = function(req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};

	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
	console.log(res.locals.messages);
	next();
};

exports.requireAdminUserAPI = function(req, res, next) {
	var session = req.session;
	var user = session.user;
	var admin = session.admin;

	if(user && admin) {
		next();
	} else {
		res.send({success: false, message: "Please sign in as admin to access this page."});
	}
};

exports.requireAdminUser = function(req, res, next) {
	var session = req.session;
	var user = session.user;
	var admin = session.admin;
	console.log("admin: " + admin);
	if(admin && user) {
		next();
	} else {
		req.flash('error', 'Please sign in as admin to access this page.');
		res.redirect('/user/login');
	}
};

