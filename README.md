# EasyWebVR2D
easily create simple VR-like Web site from 2D images using three.js（https://threejs.org/）

## Description
this makes 2D designers and illustrators be able to easily create VR-like web site like this(<https://sonon.uh-oh.jp/atelier/atelier.html>).

## Function
* Set Images in 360 degree space.
* Controll Gaze by smart phone jyro sensor or touch and click
* image link and pop-up window

## Demo
<https://sonon.uh-oh.jp/EasyWebVR2D_demo/>

## Usage

1. Prepare images for background and object items.
2. set image source, position and reaction when clicked in dataset.js as follows

```dataset.js
//background img src
bg_img_path = 'img/bg01.png';

//img src
var src_dic = { 
	img00:'img00.png',
  img01:'img01.png',
};

//position(display_width, display_height, longitude, latitude, radius = distance)
var pos_dic = {
	img00:new Array(150, 150, 0, 30, 300),
  img01:new Array(250, 460, 72, 10, 300),
};

//when img clicked
var click_action_dic ={
	img00: function(){ makeMessage("<h1>Hello<h1> <p>Message</p>") },
	img01: function(){ JumpToLink("https://www.google.com/")},
};
```

## Licence
Distributed under the terms of the MIT license.
http://www.opensource.org/licenses/mit-license.html


**Please note that I do not take any responsibility or liability for any loss, damages and troubles.**
