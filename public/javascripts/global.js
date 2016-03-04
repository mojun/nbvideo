var colorsN3=['red','green','blue','yellow'];
var titlesN3=['Oops','Well done','Reminder','Attention'];
var contentsN3=['Sorry, something went wrong','You perfectly clicked a button','Don\'t forget to click the button one more time','Take care out there'];
var currentColorN3=0;
var noticeN3Volume=100;

var supportedFileTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/x-icon', 'application/pdf', 'image/x-tiff', 'image/x-tiff', 'application/postscript', 'image/vnd.adobe.photoshop'];

function jAlert(color, title, content){
	new jBox('Notice',{
		attributes:{x:'left',y:'bottom'},
		theme:'NoticeBorder',
		color:'black',
		audio:'/javascripts/jBox/audio/bling2',
		volume:noticeN3Volume,
		animation:{
			open:'slide:bottom',
			close:'slide:left'
		},
		onInit:function(){
			this.options.color=color;
			this.options.title=title;
			this.options.content=content;
		}
	});
}

