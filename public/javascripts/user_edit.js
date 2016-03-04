
$(document).ready(function(){
	var supportedTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/x-icon', 'application/pdf', 'image/x-tiff', 'image/x-tiff', 'application/postscript', 'image/vnd.adobe.photoshop'];

	var $uploadBtn = $('#btn-upload-image');
	var $changeBtn = $('#btn-change-image');
	var $undoBtn = $('#btn-undo-image');
				
	var $uploadField = $('#field-upload-image');
	var $changeField = $('#field-change-image');
	var $resultImg = $('#head-image-result');
	$uploadBtn.click(function(e){
		e.preventDefault();
		$uploadField.click();
	});

	$changeBtn.click(function(e){
		e.preventDefault();
		$changeField.click();
	});

	$uploadField.change(function(e){
		var imageSelected = $(this).val() ? true : false;
		if (imageSelected) {
			var files = e.target.files;
			if(files.length > 1) {
				$uploadField.val('');
				alert("只支持上传一个文件");
				return;
			}
			var file = e.target.files[0];
			if(!_.contains(supportedTypes, file.type)) {
				$uploadField.val('');
				alert("不支持上传文件格式");
				return;
			}

			var fileReader = new FileReader();
			fileReader.onload = (
				function(f) {
					return function(ee) {
						$resultImg.prop('src', ee.target.result).prop('title', file.name);
					};
				}
			)(file);
			fileReader.readAsDataURL(file);
		}
	});

	$changeField.change(function(e){
		var imageSelected = $(this).val() ? true : false;
		if (imageSelected) {
			var files = e.target.files;
			if(files.length > 1) {
				$uploadField.val('');
				alert("只支持上传一个文件");
				return;
			}
			var file = e.target.files[0];
			if(!_.contains(supportedTypes, file.type)) {
				$uploadField.val('');
				alert("不支持上传文件格式");
				return;
			}

			$undoBtn.css('display','inline');
			var fileReader = new FileReader();
			fileReader.onload = (
				function(f) {
					return function(ee) {
						$resultImg.prop('src', ee.target.result).prop('title', file.name);
					};
				}
			)(file);
			fileReader.readAsDataURL(file);

		}
	});

	$undoBtn.click(function(e){
		e.preventDefault();
		
		$undoBtn.css('display','none');
		console.log($resultImg);
		var headURL = $resultImg.attr('headimageurl');
		console.log("111 " + headURL);
		$resultImg.prop('src', headURL);
	});


});