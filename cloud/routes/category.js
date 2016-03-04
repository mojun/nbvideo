var category = require('cloud/controllers/category');

exports = module.exports = function(app, sdk) {
	category.setSDK(sdk);

	app.get('/admin/page/categoryList', category.categoryPage);

	app.post('/admin/api/category/create', category.createMain);

	app.post('/admin/api/category/update', category.updateMain);

	app.get('/admin/page/categoryList/sub', category.categorySubListPage);

	app.post('/admin/api/category/create/sub', category.createSub);

	app.post('/admin/api/category/update/sub', category.updateSub);

	
};