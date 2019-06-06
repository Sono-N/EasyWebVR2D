//background img src
bg_img_path = 'img/bg01.png';

//img src
img_directory = 'img/items/';

var src_dic = { 
	img00:img_directory+'img00.png',
    img01:img_directory+'img01.png',
    img02:img_directory+'img02.png',
    img03:img_directory+'img03.png',
	img04:img_directory+'img04.png',
};

//position(display_width, display_height, longitude, latitude, radius = distance)
var pos_dic = {
	img00:new Array(150, 150, 0, 30, 300),
    img01:new Array(250, 460, 72, 10, 300),
    img02:new Array(100, 100, 144, 0, 300),
    img03:new Array(256, 256, 216, -20, 300),
	img04:new Array(200, 150, 288, -5, 300),
};

//when img clicked
var click_action_dic ={
	img01: function(){ makeMessage("<h1>Hello<h1> <p>Message</p>") },
	img04: function(){ JumpToLink("https://www.google.com/")},
};