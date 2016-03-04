var imageHost = "http://mojun.github.io/appimage/nbvideo/";
$(document).ready(function(){
	var mainCategoryId = $("h2:first").attr("maincategoryid");
    var $categoryCreateModalBtn = $("#category-create");
    var $categoryUpdateModalBtn = $("#category-update");
    var $categoryCreateModal = $("#category-create-modal");
    var $categoryLeftTable = $("#category-table-left");
    var $categoryRightTable = $("#category-table-right");
    var $uploadPicField = $("#upload-pic");
    var $categoryCreateBtn = $("button[data-target='#category-create-modal']");
    var $categoryUpdateBtn = $categoryCreateBtn;

    $categoryCreateBtn.click(function(e){
        $("#category-name").val('');
        $("#category-description").val('');
        $("#pic-path").val('');
        $("#category-create").css("display", "inline-block");
        $("#category-update").css("display", "none");
    });

    $categoryCreateModal.on('hide.bs.modal', function(e){
        var dataTag = $(".current-edit");
        dataTag.removeClass("current-edit");
    });


    $categoryCreateModal.modal({backdrop: 'static', show: false});
    $categoryCreateModalBtn.click(function(e){
        e.preventDefault();
        console.log("create");
        var cm_name = $("#category-name").val();
        var cm_desc = $("#category-description").val();
        var picPath = $("#pic-path").val();
        if(cm_name.length > 0 && cm_desc.length > 0 && picPath.length > 0) {
            console.log(cm_name);
            console.log(cm_desc);
            var self = $(this);
            self.waiting({fixed: true});
            $.post("/admin/api/category/create/sub",{name: cm_name, desc: cm_desc, picPath: picPath, objectId:mainCategoryId},function(result){
                self.waiting('done');
                if(result.success) {
                    $("#category-name").val('');
                    $("#category-description").val('');
                    $("#pic-path").val('');
                    var $categoryTable = $categoryRightTable;
                    if($categoryLeftTable.children().length == $categoryRightTable.children().length) {
                        $categoryTable = $categoryLeftTable;
                    }
                    var h2DataTag = $("h2");
                    var mainPicUrl = h2DataTag.attr("mainPicUrl");
                    var mainCategoryDesc = h2DataTag.attr("mainCategoryDesc");
                    var mainCategoryId = h2DataTag.attr("mainCategoryId");
                    var mainCategoryName = h2DataTag.text();

                    var hrefURL = "/video/list/bycategory?objectId=" + result.objectId+"&name=" + cm_name + "&desc=" + cm_desc + "&picpath=" + picPath + "&mainCategoryName="+mainCategoryName+"&mainCategoryDesc="+mainCategoryDesc+"&mainCategoryId="+mainCategoryId+"&mainPicUrl="+mainPicUrl;
                    var html = '<a href="' + hrefURL+ '" objectid='+result.objectId+' class="list-group-item"><h4 class="list-group-item-heading">'+cm_name+'</h4><p class="list-group-item-text">'+cm_desc+'</p><img class="category-pic img-thumbnail" src='+imageHost + picPath+' alt="..." /><button type="button" data-toggle="modal" data-target="#category-create-modal" class="btn btn-default btn-edit-category" style="display: none;">编辑</button></a>';
                    var child = $(html);
                    $categoryTable.append(child);
                    addHoverEventForList(child);
                    addEventForList(child.children("button"));
                    $categoryCreateModal.modal('hide');
                } else {
                    alert("创建分类失败");
                }
            });
            
        } else {
            alert("请填写规范");
        }

    });

	$categoryUpdateModalBtn.click(function(e){
        e.preventDefault();
        console.log("update");
        var cm_name = $("#category-name").val();
        var cm_desc = $("#category-description").val();
        var picPath = $("#pic-path").val();
        if(cm_name.length > 0 && cm_desc.length > 0 && picPath.length > 0) {
            console.log(cm_name);
            console.log(cm_desc);
            var self = $(this);
            self.waiting({fixed: true});
            var postData = {name: cm_name, desc: cm_desc, picPath: picPath};
            var dataTag = $(".current-edit:first");
            var objectId = dataTag.attr("objectid");
            postData.objectId = objectId;
            
            $.post("/admin/api/category/update/sub", postData, function(result){
                self.waiting('done');
                if(result.success) {
                    $("#category-name").val('');
                    $("#category-description").val('');
                    
                    dataTag.children("h4").text(cm_name);
                    dataTag.children("p").text(cm_desc);
                    dataTag.children("img").attr("src", imageHost + picPath);
                    
                    var h2DataTag = $("h2");
                    var mainPicUrl = h2DataTag.attr("mainPicUrl");
                    var mainCategoryDesc = h2DataTag.attr("mainCategoryDesc");
                    var mainCategoryId = h2DataTag.attr("mainCategoryId");
                    var mainCategoryName = h2DataTag.text();
                    var hrefURL = "/video/list/bycategory?objectId=" + objectId+"&name=" + cm_name + "&desc=" + cm_desc + "&picpath=" + picPath + "&mainCategoryName="+mainCategoryName+"&mainCategoryDesc="+mainCategoryDesc+"&mainCategoryId="+mainCategoryId+"&mainPicUrl="+mainPicUrl;
                    dataTag.attr("href", hrefURL);
                    dataTag.removeClass("current-edit");
                    //找到 目前编辑的分类
                    
                    $categoryCreateModal.modal('hide');
                } else {
                    alert("修改分类失败");
                }
            });
        } else {
            alert("请填写规范");
        }
    });

	// jAlert('green', cm_name, "创建子分类成功");
	// jAlert('red', "创建子分类失败", "请检查...");

	addEventForList($(".btn-edit-category"));

    addHoverEventForList($(".row a.list-group-item"));
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

//编辑列表
function addEventForList(child) {
    child.click(function(e){
        e.preventDefault();
        $("#category-create").css("display", "none");
        $("#category-update").css("display", "inline-block");
        var self = $(this);
        var dataTag = self.parent();
        var objectId = dataTag.attr('objectid');
        var name = dataTag.children("h4").text();
        var desc = dataTag.children("p").text();
        var picUrl = dataTag.children("img").attr("src");
        console.log("name:" + name);
        console.log("desc:" + desc);
        console.log("picUrl:" + picUrl);
        dataTag.addClass("current-edit");
        var picPath = picUrl.substr(imageHost.length);
        $("#category-name").val(name);
        $("#category-description").val(desc);
        $("#pic-path").val(picPath);
        //e.stopPropagation();
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

