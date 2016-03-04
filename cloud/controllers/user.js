var AV = null;
var async = require("async");

exports.setSDK = function(sdk) {
    AV = sdk;
};

exports.userListPage = function(req, res) {
    res.locals.section = "users";

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

    var ascending = true;
    fetchUserData(pageIndex, pageSize, ascending, function(jsonObject){
        if(!jsonObject.success) {
            req.flash('error', '请登录管理员账户');
            res.redirect('/user/login');
        } else {
            var totalCount = jsonObject.totalCount;
            var mod = totalCount % pageSize;
            jsonObject.totalPages = Math.ceil(totalCount/pageSize);
            jsonObject.currentPage = pageIndex;
            console.log("ppp =  " + pageIndex);
            jsonObject.previousPage = (pageIndex > 1) ? (pageIndex - 1) : false;
            jsonObject.nextPage = (pageIndex < jsonObject.totalPages) ? (pageIndex + 1) : false;
            getPages(jsonObject, 8);
            jsonObject.messages = {success: ['用户列表数据获取成功'], info:[], error:[], warning:[]};
            res.render('pages/userList',jsonObject);
        }
        
    });
};

exports.userList = function(req, res) {
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

    var ascending = true;
    fetchUserData(pageIndex, pageSize, ascending, function(jsonObject){
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
            jsonObject.messages = {success: ['用户列表数据获取成功'], info:[], error:[], warning:[]};
            res.send(jsonObject);
        }
    });
};

exports.loginPage = function(req, res) {
    res.render('pages/login');
};

exports.login = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    AV.User.logIn(email, password, {
        success: function(user) {
            req.session.user = user;
            var rolePointer = user.get("role");
            var roleId = rolePointer.id;
            var roleQuery = new AV.Query(AV.Role);
            roleQuery.get(roleId, {
                success: function(role) {
                    console.log("manager:" + role.get("name"));
                    req.session.admin = role.get("name") == "manager"; 
                    console.log("登录用户:>>>");
                    console.log(JSON.stringify(user));
                    req.flash('success', '用户' + user.getUsername() + '登录成功');
                    res.redirect('/');
                },
                error: function(role, error) {
                    req.flash('error', error.message);
                    res.redirect('/user/login')
                }
            });
        },
        error: function(user, error) {
            req.flash('error', error.message);
            console.log("do" + error.message);
            res.redirect('/user/login')
        }
    });
};

exports.logout = function(req, res) {
    req.session.user = undefined;//清除session
    req.session.tmpUser = undefined;
    req.session.admin = undefined;
    AV.User.logOut();
    res.redirect('/');
};

exports.userDetailPage = function(req, res) {
    var objectId = req.query.objectId;
    var query = new AV.Query(AV.User);
    console.log("detail page");
    query.get(objectId,{
        success:function(user){
            req.session.tmpUser = user;
            res.render('pages/userDetail',{user: user.toJSON()});
        },
        error:function(user, error){
            res.locals.messages = {error: ['没找到修改的用户'], info:[], success:[], warning:[]};
            res.render('pages/userDetail');
        }
    });
};

exports.columnList = function(req, res) {
    var pageIndex = req.query.pageIndex;
    var columnType = req.query.columnType;
    var result = {columnType: columnType, pageIndex: pageIndex};
    console.log(result);
    res.send(result);

};

function fetchUserData(pageIndex, pageSize, ascending, cb){
    var items = [
        {
            kFun: fetchUser,
            kV1: pageIndex,
            kV2: pageSize,
            kV3: ascending
        }, 
        {
            kFun: fetchUserCount
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

function fetchUser(cb, pageIndex, pageSize, ascending) {
    var query = new AV.Query(AV.User);
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
                
                // var timeString = results[i].createdAt.Format("yyyy-MM-dd hh:mm:ss");
                // console.log(i + ":  "+timeString+"  ---------  "+typeof(result) + "  --------");
                console.log(result);
                // result.createdAt = timeString;
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



function fetchUserCount(cb) {
    
    AV.Query.doCloudQuery('select count(*) from _User', {
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
