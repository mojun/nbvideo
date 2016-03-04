var imageHost = "http://mojun.github.io/appimage/nbvideo/";
$(document).ready(function(){
	var $videoCreateModalBtn = $("#video-create-btn");
	var $videoUpdateModalBtn = $("#video-update-btn");
	var $videoCUModal = $("#video-create-modal");
	
	var $uploadPicBtn = $("#upload-pic-btn");
	var $videoCreateBtn = $("button[data-target='#video-create-modal']");
    var $videoTable = $("#video-table");

	$videoCreateBtn.click(function(e){
		//清除field里面的内容
		
        $("#video-name").val('');
        $("#video-description").val('');
        $("#video-id").val('');
        $("#video-url").val('');
        $("#video-time").val('');
        $("#video-summary").val('');
        $("#pic-path").val('');
        $("#video-sid option:first").attr('selected','selected');
        $("#video-type option:first").attr('selected', 'selected');
        $("#pushbox").attr("checked", false);
        //创建按钮点击 那么显示创建按钮 隐藏更新按钮
        $videoCreateModalBtn.css("display", "inline-block");
        $videoUpdateModalBtn.css("display", "none");
	});

	$videoCUModal.on('hide.bs.modal', function(e){
		var dataTag = $(".current-edit");
        dataTag.removeClass("current-edit");
	});

    $videoCUModal.modal({backdrop: 'static', show: false});

    //modal新建按钮点击
    $videoCreateModalBtn.click(function(e){
    	e.preventDefault();
    	console.log("create");
    	e.preventDefault();
    	var name = $("#video-name").val();
		var desc = $("#video-description").val();
		var vid = $("#video-id").val();
		var vurl = $("#video-url").val();
    	var sid = $("#video-sid").val();
        var vtime = $("#video-time").val();
        var summary = $("#video-summary").val();
    	var picPath = $("#pic-path").val();
        if(name.length > 0 && vtime.length > 0 && vid.length > 0 && vurl.length > 0 && picPath.length > 0) {
        	var self = $(this);
            self.waiting({fixed: true});
        	var subCategoryDataTag = $("h2");
    		var subCategoryId = subCategoryDataTag.attr("subcategoryid");
			var postData = {};
			postData.name = name;
			postData.desc = desc;
			postData.vid = vid;
			postData.vurl = vurl;
			postData.sid = sid;
            postData.vtime = vtime;
			postData.picPath = picPath;
			postData.subCategoryId = subCategoryId;
            postData.push = $( "input:checked" ).length >= 1;
            postData.summary = summary;
        	$.post("/admin/api/video/create", postData, function(result){
        		self.waiting('done');
        		if(result.success) {
                    $("#pic-path").val('');
                    $("#video-name").val('');
                    $("#video-description").val('');
                    $("#video-id").val('');
                    $("#video-url").val('');
                    $("#video-time").val('');
                    $("#video-summary").val('');
                    $("#video-sid option:first").attr('selected','selected');

                    var vvurl = "/video/player?sid=" + sid + "&vid="+vid+"&name="+name + "&desc="+desc;
                    var html = '<a target="_blank" href="' + vvurl+ '" objectid='+result.objectId+ ' vid='+ vid + ' vtime=' + vtime  + ' sid=' + sid + ' summary=' + summary +' vurl=' +vurl + ' vtype=' + vtype +' class="list-group-item"><h4 class="list-group-item-heading">'+name+'</h4><p class="list-group-item-text">'+desc+'</p><img class="video-pic img-thumbnail" src='+imageHost + picPath +' alt="..." /><button type="button" data-toggle="modal" data-target="#video-create-modal" class="btn btn-default btn-edit-video" style="display: none;">编辑</button></a>';

                    var child = $(html);
                    if(parseInt($("h2").attr("isAdmin")) == 0) {
                        child.children("button").addClass("hide-edit-button");
                    }
                    $videoTable.prepend(child);
                    addHoverEventForList(child);
                    addEventForList(child.children("button"));
                    $videoCUModal.modal('hide');

        		} else {
        			alert("创建视频失败");
        		}
	    	}); 
        } else {
        	alert("请填写规范");
        }

    });

    //modal修改按钮点击
    $videoUpdateModalBtn.click(function(e){
    	e.preventDefault();
    	console.log("update");
    	e.preventDefault();
        var name = $("#video-name").val();
        var desc = $("#video-description").val();
        var vid = $("#video-id").val();
        var vurl = $("#video-url").val();
        var sid = $("#video-sid").val();
        var vtime = $("#video-time").val();
        var summary = $("#video-summary").val();
        var vtype = $("#video-type").val();
        var picPath = $("#pic-path").val();
        if(name.length > 0 && vtime.length > 0 && vid.length > 0 && vurl.length > 0 && picPath.length > 0) {
            var self = $(this);
            self.waiting({fixed: true});
            var subCategoryDataTag = $("h2");
            var subCategoryId = subCategoryDataTag.attr("subcategoryid");
            var postData = {};
            postData.name = name;
            postData.desc = desc;
            postData.vid = vid;
            postData.vurl = vurl;
            postData.sid = sid;
            postData.vtime = vtime;
            postData.summary = summary;
            postData.vtype = vtype;
            var dataTag = $(".current-edit");
            postData.objectId = dataTag.attr("objectid");
            postData.picPath = picPath;
            postData.push = $( "input:checked" ).length >= 1;
            postData.subCategoryId = subCategoryId;
            $.post("/admin/api/video/update", postData, function(result){
                self.waiting('done');
                if(result.success) {
                    
                    $("#pic-path").val('');
                    $("#video-name").val('');
                    $("#video-description").val('');
                    $("#video-id").val('');
                    $("#video-url").val('');
                    $("#video-time").val('');
                    $("#video-summary").val('');
                    $("#video-sid option:first").attr('selected','selected');                    
                    $videoCUModal.modal('hide');

                    
                    dataTag.children("h4").text(name);
                    dataTag.children("p").text(desc);
  
                    dataTag.children("img").attr("src", imageHost + picPath);
                    dataTag.attr("vurl", vurl);
                    dataTag.attr("vid", vid);
                    dataTag.attr("vtime", vtime);
                    dataTag.attr("sid", sid);
                    dataTag.attr("desc", desc);
                    dataTag.attr("name", name);
                    dataTag.attr("summary", summary);
                    dataTag.attr("vtype", vtype);
                    dataTag.attr("href","/video/player?sid=" + sid + "&vid="+vid+"&name="+name + "&desc="+desc);

                    dataTag.removeClass("current-edit");
                } else {
                    alert("创建视频失败");
                }
            }); 
        } else {
            alert("请填写规范");
        }
    });

    addEventForList($(".btn-edit-video"));

    addHoverEventForList($(".row a.list-group-item"));

    //点击页码按钮
    $("ul.pagination li a").click(function(e){
        e.preventDefault();
        var self = $(this);
        var parentLi = self.parent();
        if(!parentLi.hasClass("active")) {
            $("body").waiting({fixed: true});
            var subcategoryId = $("h2:first").attr("subcategoryid");
            var pageIndexText = self.attr("page");
            $.get("/video/list/bycategory/api",{pageIndex: pageIndexText, objectId:subcategoryId}, function(result){
                if(result.success) {
                    var parentUl = parentLi.parent();
                    parentUl.children("li").removeClass("active");
                    parentLi.addClass("active");
                    var pageTag = $("#pageIndexTag");
                    pageTag.attr("page", pageIndexText);
                    pageTag.text("第"+pageIndexText+"页");
                    $videoTable.empty();
                    console.log(result);
                    
                    var isAdmin = parseInt($("h2").attr("isAdmin")) == 1;
                    var videoList = result.videoList;
                    for( i in videoList) {
                        var videoData = videoList[i];
                        var vurl = videoData.vurl;
                        var objectId = videoData.objectId;
                        var vid = videoData.vid;
                        var vtime = videoData.vtime;
                        var sid = videoData.sid;
                        var name = videoData.name;
                        var desc = videoData.desc;
                        var summary = videoData.summary;
                        var picurl = videoData.pic.url;
                        var vtype = videoData.vtype;

                        var vvurl = "/video/player?sid=" + sid + "&vid="+vid+"&name="+name + "&desc="+desc;
                        var html = '<a target="_blank" href="' + vvurl+ '" objectid='+objectId+ ' vid='+ vid + ' vtime=' + vtime  + ' sid=' + sid + ' summary=' +summary + ' vurl=' + vurl + ' vtype=' + vtype +' class="list-group-item"><h4 class="list-group-item-heading">'+name+'</h4><p class="list-group-item-text">'+desc+'</p><img class="video-pic img-thumbnail" src='+imageHost + picPath +' alt="..." /><button type="button" data-toggle="modal" data-target="#video-create-modal" class="btn btn-default btn-edit-video" style="display: none;">编辑</button></a>';

                        var child = $(html);
                        if(!isAdmin) {
                            child.children("button").addClass("hide-edit-button");
                        }
                        $videoTable.append(child);
                        addHoverEventForList(child);
                        addEventForList(child.children("button"));
                    }
                    $("body").waiting("done");
                    //删除之前的数据
                } else {
                    $("body").waiting("done");
                    alert("请重新再试");
                }
            });

        } else {
            console.log("same li");
        }
    })
});

function addHoverEventForList(child) {
    child.hover(function(e){
        //in
        $(this).children("button").css("display", "block");
    }, function(e){
        //out
        $(this).children("button").css("display", "none");
    });
}

function addEventForList(child) {
    child.click(function(e){
        e.preventDefault();
        var $videoCreateModalBtn = $("#video-create-btn");
        var $videoUpdateModalBtn = $("#video-update-btn");
        $videoCreateModalBtn.css("display", "none");
        $videoUpdateModalBtn.css("display", "inline-block");
        var self = $(this);
        var dataTag = self.parent();
        var objectId = dataTag.attr("objectid");
        var name = dataTag.children("h4").text();
        var description = dataTag.children("p").text();
        var picUrl = dataTag.children("img").attr("src");
        var vurl = dataTag.attr("vurl");
        var vid = dataTag.attr("vid");
        var vtime = dataTag.attr("vtime");
        var sid = dataTag.attr("sid");
        var vtype = dataTag.attr("vtype");
        var summary = dataTag.attr("summary");
        dataTag.addClass("current-edit");

        var picPath = picUrl.substr(imageHost.length);
        $("#video-name").val(name);
        $("#video-description").val(description);
        $("#video-id").val(vid);
        $("#video-time").val(vtime);
        $("#video-url").val(vurl);
        $("#video-sid").val(sid);
        $("#video-type").val(vtype);
        $("#video-summary").val(summary);
        $("#pic-path").val(picPath);
    });
}

function checkIsHTTP(url) {
    var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp=new RegExp(Expression);
    if(objExp.test(url) == true) {
        return true;
    } else {
        return false;
    }
}
