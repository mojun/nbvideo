var AV = require('avoscloud-sdk').AV;


exports = module.exports = function(app) {
	app.get('/test',function(req, res){
		// res.send({tesor: 'tttt'});
		res.render('test');
	});

	app.post('/test/upload', function(req, res){
		var base64Data = req.body.file_base64;
		base64Data = base64Data.replace(/^data:.*;base64,/,"");
		var file = new AV.File("14.png", {base64: base64Data});
		file.save({
			success: function(file){ //AV.File
				
			},
			error: function(error){
				console.log("error: ", error);
			}
		});
	});
};
