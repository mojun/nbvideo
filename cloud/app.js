// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var path = require('path');
var flash = require('connect-flash');
var middleware = require('cloud/middleware');

var app = express();

var fs = require('fs');

//app.use(express.logger());

app.use(express.favicon());
// var pathString = path.join(path.resolve(), 'package.json');
// console.log("-- >>> " + pathString);
// var pkg = JSON.parse(fs.readFileSync('package.json'));
var pkg = { name: 'Kimoworks',
  version: '1.0.0',
  author: 'MJ',
  private: true,
  description: '这是一个测试express的Demo web App!',
  keywords: [ 'express', '中国', 'test', 'demo' ]
 };

middleware.setPKG(pkg);
//console.log(__filename);

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'jade');    // 设置 template 引擎

app.configure(function() {
	app.use(express.cookieParser());
	app.use(express.bodyParser());		//读取请求body的中间件
	app.use(express.methodOverride());
	app.use(express.session({
		secret: pkg.name,
		cookie:{
			path: '/',
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000 //十分钟的session 
		}
	}));

	app.use(flash());

	app.use(function(req, res, next) {
		res.locals.pkg = pkg;
		next();
	});
	app.use(middleware.initLocals);
	app.use(middleware.sessionLocals);
	app.use(middleware.flashMessages);
});

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
	// AV.Cloud.define("hello", function(request, response) {

	  
	// });

	var query = new AV.Query("Comment");
	console.log("start requ e  st hello function");
	query.count({
		success: function(number) {
			res.render('helloj', { message: '110Congrat----s, you just set up your app! count: ' + number });
			// response.success(number + 10);
		},
		error: function(error) {
			console.log(error);
			response.error(error);
		}
	});
  
});

app.all('/admin/api/*', middleware.requireAdminUserAPI);
app.all('/admin/page/*', middleware.requireAdminUser);

require('cloud/routes/index')(app);
require('cloud/routes/user')(app, AV);
require('cloud/routes/category')(app, AV);
require('cloud/routes/video')(app, AV);
require('cloud/testor')(app);
require('cloud/routes/ymmbd')(app);

app.use(app.router);

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();