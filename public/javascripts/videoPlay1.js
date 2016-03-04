$(document).ready(function(){

    var $container = $(".article-main__bodyer");
    var $player = $("#player");
    var width = 610;
    var height = 498;
    var dWidth = parseInt($container.css("width"));//document.body.scrollWith;
    if(dWidth <= width) {
        width = dWidth + "px";
        height = parseInt((498.0 / 610.0) * dWidth) + "px";
    }
    console.log("width" + width);
    console.log("height" + height);

    $player.css({display: "block", width: width, height: height, margin: "0 auto"});


});
