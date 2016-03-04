var objectId = null;
var columns = ["myHistoryVideos", "myCollectVideos", "myPublishPosts", "myCollectPosts"];

$(document).ready(function(){
	objectId = $("h2").attr("objectId");

	$("#myTab li:eq(0) a").tab("show");
	getColumnList(0, 1, $("#" + columns[0]));

	$("#myTab a").click(function (e){
		e.preventDefault()
		var sender = $(this);
		sender.tab('show');
		var idWithSharp = sender.attr("href");
		var id = idWithSharp.substr(1);//截取#
		var idx = columns.indexOf(id);

		console.log("index=" + idx);
		console.log("idWithSharp=" + idWithSharp);
		console.log("objectId=" + objectId);
		var tabPanel = $(idWithSharp);
		if(tabPanel.children().length <= 0) {
			//do something
			console.log("请求");
			getColumnList(idx, 1, tabPanel);//page start from 1
		} else {
			console.log("不");
		}
		
	});
});

function getColumnList(columnType, pageIndex, parent) {
	$.get("/user/column/list", {columnType: columnType, pageIndex: pageIndex}, function(data){
		console.log("pageIndex:  " + data.pageIndex);
		console.log("columnType: " + data.columnType);
	});
}

// div.tab-pane(role="tabpanel", id="myHistoryVideos") 我看过的视频
//         div.tab-pane(role="tabpanel", id="myCollectVideos") 我收藏的视频
//         div.tab-pane(role="tabpanel", id="myPublishPosts") 我发布的帖子
//         div.tab-pane(role="tabpanel", id="myCollectPosts") 我收藏的帖子