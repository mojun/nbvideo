var AV = null;
var async = require("async");

exports.setSDK = function(sdk) {
    AV = sdk;
};

exports.categoryPage = function(req, res) {
    res.locals.section = "category";
    var MCategoryMain = AV.Object.extend("MCategoryMain");
    var query = new AV.Query(MCategoryMain);
    query.ascending("createdAt");

    query.find({
        success: function(results) {
            var categorys = [];
            for (var i = 0; i < results.length; i++) {
                var object = results[i].toJSON();
                categorys.push(object);
                console.log("o: " + JSON.stringify(object)); 
            };
            res.render('pages/categoryList', {categorys: categorys});
        },
        error: function(error) {
            req.flash('error', error.message);
            res.redirect('/');
        }
    });
};

exports.createMain = function(req, res) {
    var name = req.body.name;
    var desc = req.body.desc;
    var picPath = req.body.picPath;

    var jsonObject = {};
    var MCategoryMain = AV.Object.extend("MCategoryMain");
    var categoryMain = new MCategoryMain();
    categoryMain.set("name", name);
    categoryMain.set("desc", desc);
    categoryMain.set("picPath", picPath);
    categoryMain.save(null, {
        success: function(cm){
            var objectId = cm.id;
            jsonObject.success = true;
            jsonObject.objectId = objectId;
            res.send(jsonObject);
        },
        error: function(cm, error) {
            jsonObject.success = false;
            res.send(jsonObject);
        }
    });
};

exports.updateMain = function(req, res) {
    var name = req.body.name;
    var desc = req.body.desc;
    var objectId = req.body.objectId;
    var picPath = req.body.picPath;

    var jsonObject = {};
    var categoryMain = AV.Object.createWithoutData("MCategoryMain", objectId);
    categoryMain.set("name", name);
    categoryMain.set("desc", desc);
    categoryMain.set("picPath", picPath);
    categoryMain.save(null, {
        success: function(cm){
            jsonObject.success = true;
            res.send(jsonObject);
        },
        error: function(cm, error) {
            jsonObject.success = false;
            res.send(jsonObject);
        }
    });
};

exports.categorySubListPage = function(req, res) {
    res.locals.section = "category";
    var objectId = req.query.objectId;
    var mainCategoryName = req.query.name;
    var mainCategoryDesc = req.query.desc;
    var picPath = req.query.picpath;
    console.log("objectID " + objectId);
    var queryParent = new AV.Query("MCategoryMain");
    queryParent.get(objectId, {
        success: function(parent){
            var subCategorysQuery = parent.relation("subCategorys").query();
            subCategorysQuery.find({
                success: function(results) {
                    var jsonObject = {};
                    var arrayResult = [];
                    for(i in results) {
                        var result = results[i].toJSON();
                        console.log(result);
                        // result.createdAt = timeString;
                        arrayResult.push(result);
                    }
                    jsonObject.subCategorys = arrayResult;
                    jsonObject.mainCategoryName = mainCategoryName;
                    jsonObject.mainCategoryDesc = mainCategoryDesc;
                    jsonObject.mainCategoryId = objectId;
                    jsonObject.mainPicUrl = picPath;
                    console.log("mainCategoryName:"+mainCategoryName);
                    console.log("results...."+JSON.stringify(arrayResult));
                    res.render('pages/categorySubList', jsonObject);
                },
                error: function(error) {
                    req.flash('error', error.message);
                    res.redirect('/');
                }
            });
        },
        error: function(error) {
            req.flash('error', error.message);
            res.redirect('/');
        }
    });  
    
};

exports.createSub = function(req, res) {
    var objectId = req.body.objectId;
    var name = req.body.name;
    var desc = req.body.desc;
    var picPath = req.body.picPath;
    var category = AV.Object.createWithoutData("MCategoryMain", objectId);
    var jsonObject = {};
    var MCategorySub = AV.Object.extend("MCategorySub");
    var categorySub = new MCategorySub();
    categorySub.set("name", name);
    categorySub.set("desc", desc);
    categorySub.set("picPath", picPath);
    categorySub.save(null, {
        success: function(categorySub) {
            var subCategorys = category.relation("subCategorys");
            subCategorys.add(categorySub);
            category.save(null, {
                success: function(r) {
                    var objectId = r.id;
                    jsonObject.success = true;
                    jsonObject.objectId = categorySub.id;
                    res.send(jsonObject);
                },
                error: function(r, error) {
                    console.log("error:" + error.message);
                    jsonObject.success = false;
                    res.send(jsonObject);
                }
            });
        },
        error: function(error) {
            onsole.log("error:" + error.message);
            jsonObject.success = false;
            res.send(jsonObject);
        }
    });
};

exports.updateSub = function(req, res) {
    var objectId = req.body.objectId;
    var name = req.body.name;
    var objectId = req.body.objectId;
    var desc = req.body.desc;
    var picPath = req.body.picPath;
    var jsonObject = {};
    var categorySub = AV.Object.createWithoutData("MCategorySub", objectId);
    categorySub.set("name", name);
    categorySub.set("desc", desc);
    categorySub.set("picPath", picPath);
    categorySub.save(null, {
        success: function(cm){
            jsonObject.success = true;
            res.send(jsonObject);
        },
        error: function(cm, error) {
            jsonObject.success = false;
            res.send(jsonObject);
        }
    });

};