var sh = require('cloud/controller/sqlitehelper');
var jsdom = require("jsdom");
var fs = require("fs");

sh.connect("ymmbd", function(err){
    if(err == null) {
        console.log("success connect db");
        sh.setup(function(err2){
            console.log("succeess set up");
        });
    }
});

exports = module.exports = function(app) {
	app.get("/ymmbd/admin", function(req, res) {
        res.render('ymmbd');
    });

	app.post("/ymmbd/add", function(req, res) {
        
        var type = req.body.type;
        var iid = req.body.iid;
        iid = parseInt(iid);
        var surl = "http://m.babytree.com/learn/article/" + iid;
        console.log("surl:" + surl);
        console.log("type:" + type);

        sh.count(function(err, count){
            jsdom.env(
                surl,
                ["http://code.jquery.com/jquery.js"],
                function (errors, window) {
                    if(errors) {
                        res.send({success: false});
                        return;
                    }

                    // var contentTag = window.$(".article");
                    //artileWen
                    //contentTag.children().remove("div:last");
                    // contentTag = contentTag.html();
                    
                    var title = window.$(".detail-box").children("h1").text();
                    var pageCountText = window.$(".pagination-number").text();
                    var pageCount = 1;
                    if(pageCountText) {
                        pageCount = parseInt(pageCountText.split("/")[1]);
                    }
                    
                // exports.add = function(iid, title, html, surl, pubtime, type, pageCount, callback) {
                    sh.add(iid, title, "", surl, "", type, pageCount, function(e){
                        console.log("pageCout: " + pageCount);
                        res.send({success: true});
                    });
              });
        });    
    });
};