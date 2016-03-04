
exports = module.exports = function(app) {
	app.get('/', function(req, res) {
		console.log("test- home");
		res.locals.section = 'home';
		res.render('pages/home');
	});
};