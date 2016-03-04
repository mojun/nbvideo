require("cloud/app.js");
require('cloud/utils/dateformater');

var async = require("async");
// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
// var cg = require('../cloud/global.json');
// AV.initialize(cg.applicationId, cg.applicationKey);

AV.Cloud.define("hello", function(request, response) {
	var query = new AV.Query("MPComment");
	console.log("start reque  st hello function");
	query.count({
		success: function(number) {
			response.success(number + 10);
		},
		error: function(error) {
			console.log(error);
			response.error(error);
		}
	});
  
});
