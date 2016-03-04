var user = require('cloud/controllers/user');

exports = module.exports = function(app, sdk) {
	//页面pages
	user.setSDK(sdk);

	app.get('/admin/page/users', user.userListPage);

	//API
	app.get('/admin/api/users/', user.userList);

	app.get('/user/login', user.loginPage);

	//添加admin要求登录
	app.get('/user/detail', user.userDetailPage);

	// 登出
	app.get('/user/logout', user.logout);

	//API 登录
	app.post('/user/login', user.login);

	//获取用户的详细信息
	app.get('/user/column/list', user.columnList);

};
