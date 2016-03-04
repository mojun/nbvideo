var video = require('cloud/controllers/video');

exports = module.exports = function(app, sdk) {
	video.setSDK(sdk);

	app.get('/video/list', video.listPage);

	app.get('/video/list/bycategory', video.categoryVideoListPage);

	app.get('/video/list/bycategory/api', video.categoryVideoList);

	// app.get('/admin/page/video/create', video.createPage);

	app.post('/admin/api/video/create', video.create);

	app.post('/admin/api/video/update', video.update);

	app.get('/admin/page/push', video.pushPage);

	app.get('/video/player', video.playerPage);
};