
$(document).ready(function(){
	var $surlInput = $("#input-surl");
 	var $addButton = $("#add-btn-surl");
 	var $postAllButton = $("#add-btn-postall");
 	var $typeSelect = $("#article-type");
 	var $resultTable = $("#item-table");
 	var $saveButton = $("#save-json-btn");
 	var host = "http://www.babytree.com/learn/article/";
 	$addButton.click(function(e){
 		e.preventDefault();
 		var surl = $surlInput.val();
 		var type = $typeSelect.val();

 		var surls = surl.split(",");
 		for(var i=0;i<surls.length;i++) {
 			var article_id = surls[i];
 			var urll = article_id;
 			var html = '<a href="#" class="list-group-item"' + ' type=' + type + '>' + urll + '</a>';
			var child = $(html);
			$resultTable.prepend(child);
 		}
 		
		$surlInput.val('');
 		// $.post("/add", {surl: surl, type: type}, function(result){
 		// 	if(result.success){

 		// 	}
 		// });
 	});

 	$saveButton.click(function(e){
 		e.preventDefault();
 		$.post("/download", null, function(result){
 			
 		});
 	});

 	$postAllButton.click(function(e){
 		e.preventDefault();
 		console.log(1);
 		var items = $resultTable.children("a");
 		for(var i=0;i<items.length;i++){
 			qu(items.eq(i));
 			console.log(i + "--|12");
 		}

 		$(document).dequeue("ajax");
 		console.log(110);
 	});
});

function qu(item) {
	var surl = item.text();
	var type = item.attr("type");
	$(document).queue("ajax", function(){
		$.post("/ymmbd/add", {iid: surl, type: type}, function(result){
			if(result.success) {
				item.css("color", "green");
				item.remove();
				setTimeout(function(){
		 			$(document).dequeue("ajax");
		 		}, 1000);
			} else {
				item.css("color", "red");
				setTimeout(function(){
		 			quNotQueue(item);
		 		}, 1000);
			}
		});
	});
}

function quNotQueue(item) {
	var surl = item.text();
	var type = item.attr("type");

	$.post("/ymmbd/add", {iid: surl, type: type}, function(result){
		if(result.success) {
			item.css("color", "green");
			item.remove();
			setTimeout(function(){
	 			$(document).dequeue("ajax");
	 		}, 1000);
		} else {
			setTimeout(function(){
	 			quNotQueue(item);
	 		}, 1000);
		}
	});
}

/*

var list = $(".result-list").children("li");
var arr  = [];
for(var i=0;i<list.length;i++){
     var item = list.eq(i).children("a");
     var href = item.attr("href");
     var article_id = href.split("/")[3];
    arr.push(article_id);
    
}
var x = arr.join(",");
console.log(x);

*/