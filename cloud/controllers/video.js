var AV = null;
var async = require("async");

var videoSources = ["优酷", "乐视", "土豆"];

exports.setSDK = function(sdk) {
    AV = sdk;
};

exports.createPage = function(req, res) {
    res.locals.section = "video";
    res.render('pages/videoCreate');
};

exports.pushPage = function(req, res) {
    res.locals.section = "push";
    res.render('pages/pushPage');
};

function isMobileAgent(requestHeader) {
    var pc_keywords = ["Windows 98","Windows ME","Windows 2000","Windows XP","Windows NT","Ubuntu","Macintosh"];
    var isMobile = true;
    for(var i in pc_keywords) {
        var v = pc_keywords[i];
        if(requestHeader.indexOf(v) >= 0) {
            isMobile = false;
            return isMobile;
        }
    }
    return isMobile;
}

exports.playerPage = function(req, res) {
    var requestHeader = req.get("user-agent");
    var isMobile = isMobileAgent(requestHeader);
    var cssFileName = null;
    if(isMobile) {
        console.log("来自手机");
        cssFileName = "videoPlay-mobile";
    } else {
        console.log("来自电脑");
        cssFileName = "videoPlay";
    }
    console.log("header--- " + requestHeader);
    var sid = req.query.sid ? parseInt(req.query.sid) : 0;
    var vid = req.query.vid ? req.query.vid : "";

    var name = req.query.name ? req.query.name : "";
    var desc = req.query.desc ? req.query.desc : "";

    res.render('pages/videoPlay', {name: name, desc: desc, cssFileName: cssFileName, sid: sid, vid: vid});
};

exports.create = function(req, res) {
    var name = req.body.name;
    var desc = req.body.desc;
    var vid = req.body.vid;
    var vurl = req.body.vurl;
    var sid = parseInt(req.body.sid);
    var push = req.body.push;
    var picPath = req.body.picPath;
    var subCategoryId = req.body.subCategoryId;
    var vtime = req.body.vtime;
    var summary = req.body.summary;
    var vtype = parseInt(req.body.vtype);

    var jsonObject = {};
    var MVideo = AV.Object.extend("MVideo");
    var video = new MVideo();
    video.set("name", name);
    video.set("desc", desc);
    video.set("vid", vid);
    video.set("vurl", vurl);
    video.set("sid", sid);
    video.set("picPath", picPath);
    video.set("vtime", vtime);
    video.set("summary", summary);
    video.set("vtype", vtype);
    video.save(null, {
        success: function(video) {
            //创建视频成功 需要添加 relation
            var subCategory = AV.Object.createWithoutData("MCategorySub", subCategoryId);
            var videos = subCategory.relation("videos");
            videos.add(video);
            subCategory.save(null, {
                success: function(r){
                    var pushObj = {};
                    pushObj.vtime = vtime;
                    pushObj.summary = summary;
                    pushObj.picurl = picPath;
                    pushObj.objectId = video.id;
                    if(push) {
                        AV.Push.send({
                            channels:["publicPush"],
                            data: {
                            alert:name,
                            badge:"Increment",
                            sound:"cheering.caf",
                            type: "视频",
                            video: pushObj
                          }
                        },{
                            success: function(){
                                jsonObject.objectId = r.id;
                                jsonObject.success = true;
                                res.send(jsonObject);
                            },
                            error: function(error){
                                jsonObject.success = false;
                                res.send(jsonObject);
                            }
                        });
                    } else {
                        jsonObject.success = true;
                        res.send(jsonObject);
                    }
                },
                error: function(r, error) {
                    console.log("error:" + error.message);
                    jsonObject.success = false;
                    res.send(jsonObject);
                }
            });
        },
        error: function(v, error) {
            console.log("error:" + error.message);
            jsonObject.success = false;
            res.send(jsonObject);
        }
    });    
};

exports.update = function(req, res) {
    var name = req.body.name;
    var desc = req.body.desc;
    var vid = req.body.vid;
    var vurl = req.body.vurl;
    var sid = parseInt(req.body.sid);
    var vtime = req.body.vtime;
    var picPath = req.body.picPath;
    var push = req.body.push;
    var summary = req.body.summary;
    var vtype = parseInt(req.body.vtype);
    console.log("push:" + push);
    var jsonObject = {};
    var objectId = req.body.objectId; //被修改视频的id
    
    var video = AV.Object.createWithoutData("MVideo", objectId);
    video.set("name", name);
    video.set("desc", desc);
    video.set("vid", vid);
    video.set("vurl", vurl);
    video.set("sid", sid);
    video.set("vtime", vtime);
    video.set("summary", summary);
    video.set("vtype", vtype);
    video.set("picPath", picPath);
    video.save(null, {
        success: function(video) {
            var pushObj = {};
            pushObj.vtime = vtime;
            pushObj.summary = summary;
            pushObj.picurl = picPath;
            pushObj.objectId = objectId;
            if(push) {
                 AV.Push.send({
                    channels:["publicPush"],
                    data: {
                    alert:name,
                    badge:"Increment",
                    sound:"cheering.caf",
                    type: "视频",
                    video: pushObj
                  }
                }, {
                    success: function(){
                        jsonObject.success = true;
                        console.log("push success");
                        res.send(jsonObject);
                    },
                    error: function(error){

                    }
                });
            } else {
                jsonObject.success = true;
                res.send(jsonObject);
            }
           
        },
        error: function(video, error) {
            jsonObject.success = false;
            res.send(jsonObject);
        }
    });
};

exports.listPage = function(req, res) {
    res.locals.section = "category";
    var pageIndex = 1;
    var pageSize = 10;

    var page = req.query.pageIndex;
    if(page && parseInt(page) >= 1) {
        pageIndex = parseInt(page);
    }

    var pageSizeText = req.query.pageSize;
    if(pageSizeText && parseInt(pageSizeText) >= 1) {
        pageSize = parseInt(pageSizeText);
    }

    var ascending = false;
    fetchVideoData(pageIndex, pageSize, ascending, function(jsonObject){
        if(!jsonObject.success) {
            req.flash('error', '请登录管理员账户');
            res.redirect('/user/login');
        } else {
            var totalCount = jsonObject.totalCount;
            var mod = totalCount % pageSize;
            jsonObject.totalPages = Math.ceil(totalCount/pageSize);
            jsonObject.currentPage = pageIndex;
            jsonObject.previousPage = (pageIndex > 1) ? (pageIndex - 1) : false;
            jsonObject.nextPage = (pageIndex < jsonObject.totalPages) ? (pageIndex + 1) : false;
            getPages(jsonObject, 8);
            jsonObject.messages = {success: ['视频列表数据获取成功'], info:[], error:[], warning:[]};
            res.render('pages/videoList',jsonObject);
        }
        
    });
};

exports.categoryVideoListPage = function(req, res) {
    res.locals.section = "category";
    var session = req.session;
    var user = session.user;
    var admin = session.admin;
    if(user && admin) {
        res.locals.isAdmin = true;
    } else {
        res.locals.isAdmin = false;
    }

    var objectId = req.query.objectId; //子分类id
    var name = req.query.name;
    var desc = req.query.desc;
    var picurl = req.query.picurl;
    var mainCategoryName = req.query.mainCategoryName;
    var mainCategoryDesc = req.query.mainCategoryDesc;
    var mainCategoryId = req.query.mainCategoryId;
    var mainPicUrl = req.query.mainPicUrl;
    var pageIndex = 1;
    var page = req.query.pageIndex;
    if(page && parseInt(page) >= 1) {
        pageIndex = parseInt(page);
    }

    console.log("cvlp _ objectId:" + objectId);
    var queryParent = new AV.Query("MCategorySub");
    var pageSize = 10;
    
    queryParent.get(objectId, {
        success: function(parent) {
            var videosQuery = parent.relation("videos").query();
            videosQuery.count({
                success: function(number) {
                    findVideoByQuery(videosQuery, pageIndex, pageSize, false, number, function(error, jsonObject){
                        if(error) {
                            console.log("1----");
                            req.flash("error", error.message);
                            res.redirect("/");
                        } else {
                            jsonObject.subCategoryName = name;
                            jsonObject.subCategoryDesc = desc;
                            jsonObject.subCategoryId = objectId;
                            jsonObject.subPicUrl = picurl;
                            jsonObject.mainCategoryName = mainCategoryName;
                            jsonObject.mainCategoryDesc = mainCategoryDesc;
                            jsonObject.mainCategoryId = mainCategoryId;
                            jsonObject.mainPicUrl = mainPicUrl;
                            jsonObject.messages = {success: ['视频列表数据获取成功'], info:[], error:[], warning:[]};
                            jsonObject.videoSources = videoSources;
                            res.render('pages/categoryVideoList',jsonObject);
                        }
                    });
                },
                error: function(error) {
                    console.log("2----");
                    req.flash("error", error.message);
                    res.redirect("/");
                }
            });
        },
        error: function(error){
            console.log("3----");
            req.flash("error", error.message);
            res.redirect("/");
        }
    });
    // (href="/video/list/bycategory?objectId="+o.objectId+"&name="+o.name+"&description="+o.description+"&picurl="+o.pic.url, objectid=o.objectId)
};

exports.categoryVideoList = function(req, res) {
    var objectId = req.query.objectId; //子分类id
    var pageIndex = 1;
    var page = req.query.pageIndex;
    if(page && parseInt(page) >= 1) {
        pageIndex = parseInt(page);
    }

    console.log("cvlp _ objectId:" + objectId);
    var queryParent = new AV.Query("MCategorySub");
    var pageSize = 10;
    
    var jsonObject = {};
    queryParent.get(objectId, {
        success: function(parent) {
            var videosQuery = parent.relation("videos").query();
            findVideoByQuery(videosQuery, pageIndex, pageSize, false, -1, function(error, jsonObject){
                if(error) {
                    jsonObject.success = false;
                    res.send(jsonObject);
                } else {
                    jsonObject.success = true;
                    res.send(jsonObject);
                }
            });
        },
        error: function(error){
            jsonObject.success = false;
            res.send(jsonObject);
        }
    });
};

function findVideoByQuery(query, pageIndex, pageSize, ascending, totalCount, cb) {
    if(ascending) {
        query.ascending("createdAt");
    } else {
        query.descending("createdAt");
    }
    
    query.limit(pageSize);
    query.skip((pageIndex - 1) * pageSize);
    query.find({
        success: function(results) {
            // results is an array of AV.Object.
            var arrayResult = [];
            for(i in results) {
                var result = results[i].toJSON();
                console.log(result);
                arrayResult.push(result);
            }
            var jsonObject = {};
            jsonObject.success = true;
            jsonObject.currentPage = pageIndex;
            jsonObject.pageSize = pageSize;
            jsonObject.videoList = arrayResult;
            jsonObject.totalCount = totalCount;
            var mod = totalCount % pageSize;
            jsonObject.totalPages = Math.ceil(totalCount/pageSize);
            jsonObject.currentPage = pageIndex;
            jsonObject.previousPage = (pageIndex > 1) ? (pageIndex - 1) : false;
            jsonObject.nextPage = (pageIndex < jsonObject.totalPages) ? (pageIndex + 1) : false;
            getPages(jsonObject, 8);
            
            cb(null, jsonObject);
        },
        error: function(error) {
            // error is an instance of AV.Error.
            cb(error, null);
        }
    });
}

function fetchVideoData(pageIndex, pageSize, ascending, cb){
    var items = [
        {
            kFun: fetchVideo,
            kV1: pageIndex,
            kV2: pageSize,
            kV3: ascending
        }, 
        {
            kFun: fetchVideoCount
        }];
    async.map(items, function(item, callback){
        var func = item.kFun;
        var v1 = item.kV1;
        var v2 = item.kV2;
        var v3 = item.kV3;
        func(function(err, result){
            callback(err, result);
        }, v1, v2, v3);
    }, function(errs, results) {
        var success = true;
        for(err in errs) {
            if (err === null) {
                success = false;
            }
        }
        var jsonObject = {};
        jsonObject.success = success;
        jsonObject.currentPage = pageIndex;
        jsonObject.pageSize = pageSize;
        if (success) {
            jsonObject.list = results[0];
            jsonObject.totalCount = results[1];
        }
        cb(jsonObject);
    });
}

function fetchVideo(cb, pageIndex, pageSize, ascending) {
    var query = new AV.Query("MVideo");
    if(ascending) {
        query.ascending("createdAt");
    } else {
        query.descending("createdAt");
    }
    
    query.limit(pageSize);
    query.skip((pageIndex - 1) * pageSize);
    query.find({
        success: function(results) {
            // results is an array of AV.Object.
            var arrayResult = [];
            for(i in results) {
                var result = results[i].toJSON();
                console.log(result);
                arrayResult.push(result);
            }
            cb(null, arrayResult);
        },
        error: function(error) {
            // error is an instance of AV.Error.
            cb(error, null);
        }
    });
}



function fetchVideoCount(cb) {
    
    AV.Query.doCloudQuery('select count(*) from MVideo', {
        success: function(result) {
            // There are number instances of MyClass.
            cb(null, result.count);
        },

        error: function(error) {
            // error is an instance of AV.Error.
            cb(error, null);
        }
    });
    
}

function getPages(options, maxPages) {
    var surround = Math.floor(maxPages / 2),
        firstPage = maxPages ? Math.max(1, options.currentPage - surround) : 1,
        padRight = Math.max(((options.currentPage - surround) - 1) * -1, 0),
        lastPage = maxPages ? Math.min(options.totalPages, options.currentPage + surround + padRight) : options.totalPages,
        padLeft = Math.max(((options.currentPage + surround) - lastPage), 0);

    options.pages = [];

    firstPage = Math.max(Math.min(firstPage, firstPage - padLeft), 1);

    for (var i = firstPage; i <= lastPage; i++) {
        options.pages.push(i);
    }

    if (firstPage !== 1) {
        options.pages.shift();
        options.pages.unshift('...');
    }

    if (lastPage !== Number(options.totalPages)) {
        options.pages.pop();
        options.pages.push('...');
    }
}