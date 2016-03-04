var kAVAppId = 'e8ezxgbkz16xh7xjbqm4hv8do0egjdr46fxk8g24azyon5ye';
var kAVAppKey = '27v3cgwz3k3wtbkxzj9feqywle9ewgcvvkditsputtxj79hj';
$(document).ready(function(){
	AV.initialize(kAVAppId, kAVAppKey);
	AV.useAVCloudGlobal();

	$("#test").click(function (){
		alert("test");
		createObject("NBVideo", 1, function(o){
			alert("success");
		});
	});
});

function createObject(className, params, cb) {

	var NBVideo = AV.Object.extend("TestObject");
	var nBVideo = new NBVideo();
	nBVideo.set('title', 'textTest');
	nBVideo.save(null, {
		success: function(o) {
			alert("success");
		},
		error: function(o, error) {
			alert("code:" + error.code + "--- message:" + error.message + "description:" + error.description);
		}
	});
}