var letvcloud_player_conf = {"vu":"91d30666dc","uu":"a04808d307","autoPlay": "0", "height":"100%", "width":"100%"};

$(document).ready(function(){
    var $container = $("#bodyer");
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
    alert("width" + width + "height: " + height);
    $player.css({display: "block", width: width, height: height, margin: "0 auto"})
});
