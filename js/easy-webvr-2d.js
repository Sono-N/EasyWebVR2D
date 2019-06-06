/*
* Copyright (c) 2016- sono-N
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/


//Global Parameters
var camera, scene, renderer;
var cube, sphere, torus, material;
var count = 0;
var moveflag = 0; /*auto move(0) or user's move(1)*/
var arflag = 0;
var lon = 0, lat = 0;
var phi = 0, theta = 0;
var fps =30;

var click_link = "";

var move_count = 0;

main();

//look at (longitude, attitude)
function directChange(lo,la){
	lon = lo;
	lat = la;

	//limit lat in -85 to 85 avoiding malfunction
	lat = Math.max( -85, Math.min( 85, lat));
	//change lat&lon into poler coordinate
	phi = THREE.Math.degToRad( 90 - lat );
	theta = THREE.Math.degToRad( lon );
	
	//change polar coordinate into cartesian coordinate(r = 100)
	camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
	camera.position.y = 100 * Math.cos( phi );
	camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );
	camera.lookAt( scene.position );

	//reset the camera gradient
	controls = new THREE.DeviceOrientationControls(camera, true);
	controls.connect();
}

function main(evt) {
	var textureLoader = new THREE.TextureLoader();
	var controls;
	
	//load background img and set it.
	textureLoader.load( bg_img_path, function (texture) {
		texture.mapping = THREE.UVMapping;
		texture.minFilter = THREE.LinearFilter
		init(texture);
		animate(); 
	});
}

//change polar coordinate into cartesian coordinate
function stor(rad1 , rad2, r){
	x = Math.cos(rad1) * Math.cos(rad2) * r;
	y = Math.cos(rad1) * Math.sin(rad2) * r;
	z = Math.sin(rad1) * r;
	var reV = new THREE.Vector3( x, y, z);
	return reV;
}

//change Mode (VR or not)
function VrMode(){
	if(arflag == 0)
	{
		arflag = 1;
	}else{
		arflag = 0;
		moveflag = 0;
	}
}


//open and display pop-up window
var makeMessage = function(title, content){
	document.getElementsByClassName("mcontent")[0].innerHTML = content;

	$("#message").css({transform:'scaleY(1)'});
	$("#message").animate({opacity:0.8});
}

//close the pop-up window
var closeMessage = function(){
	$("#message").animate({opacity:0});
	$("#message").css({transform:'scaleY(0)'});
}

var JumpToLink = function(url){
	location.href = url;
}

//Add 2D images to scene
function AddImgToScene(scene, texture, x, y, lon, lat, r, name){
	var plane1 =  new THREE.Mesh(
		new THREE.PlaneGeometry(x, y, 1, 1),
		new THREE.MeshBasicMaterial({
			map:texture, transparent: true
		})
	);
	lon_rad =Math.PI* 2 * lon/360.0; 
	lat_rad =-Math.PI *2* lat/360.0;

	xyz = stor(lon_rad, lat_rad, r);
	x = xyz.x;
	y = xyz.y;
	z = xyz.z;

	//plane1.rotation.set(0,Math.PI/2-lat,0);
	plane1.rotation.set(0, Math.PI/2-lon_rad,0);
	plane1.position.set( -x, y, -z);
	plane1.name =  name;
	scene.add(plane1);
}

//get device information
var getDevice = (function(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod')>0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return 'sp';
    }else{
        return 'pc';
    }
})();


//initialize
function init( texture ) {
	//setting "touch" or "mouse"
	buttonStart = null,
    buttonMove = null,
    buttonEnd = null;
    if(getDevice == 'sp')
    {
        buttonStart = 'touchstart';
        buttonMove = 'touchmove';
        buttonEnd = 'touchend';
    }
    else 
    {
        buttonStart = 'mousedown';
        buttonMove = 'mousemove';
        buttonEnd = 'mouseup';
    }
    //create new camera and new scene
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	scene = new THREE.Scene();
	
	//create celestial sphere
	var mesh = new THREE.Mesh( new THREE.SphereBufferGeometry( 500, 32, 16 ), new THREE.MeshBasicMaterial( { map: texture } ) );
	mesh.geometry.scale( -1, 1, 1 );
	scene.add( mesh );
	//Rendering settings
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	//White Light setting
	var light = new THREE.AmbientLight(0xcccccc);
	scene.add( light)

	//Camera Control
	controls = new THREE.DeviceOrientationControls(camera, true);
	controls.connect();

	//texture loader
	var loader1 = new THREE.TextureLoader();

	//load textures of src_dic
	keys = Object.keys(src_dic);
	for(i=0, l=keys.length; i<l; i++){
		key = keys[i];
		texture_m = loader1.load(src_dic[key]);
		pos = pos_dic[key];
		AddImgToScene(scene, texture_m, pos[0], pos[1], pos[2], pos[3], pos[4], key);
	}

	document.body.appendChild( renderer.domElement );						
	sphere = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( 20, 3 ), material );
	document.addEventListener( buttonStart, onDocumentMouseDown, false );
	window.addEventListener( 'resize', onWindowResized, false );
}


//adjusting window size
function onWindowResized( event ) {
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

//when user click the scene
function onDocumentMouseDown( event ) 
{
	moveflag = 1; // stop auto move

	if(getDevice =="pc"){
		event.preventDefault();
		//Get clicked position
		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;
	}
	else{
		//Get touched position
		onPointerDownPointerX = event.changedTouches[0].clientX;
		onPointerDownPointerY = event.changedTouches[0].clientY;
	}
	//normalize clicked or touched position(-1 ~ 1)
	var mouse = new THREE.Vector2();
	mouse.x =  ( onPointerDownPointerX / window.innerWidth ) * 2 - 1;
	mouse.y = -( onPointerDownPointerY / window.innerHeight ) * 2 + 1;
	//Get ray that extends in the direction
	var raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, camera );
	//Determine if there is any object that intersects the ray
	var intersects = raycaster.intersectObjects( scene.children );
	//get the name of object that intersects the ray
	if(intersects.length > 1){
		click_link = intersects[0].object.name;
	}
	onPointerDownLon = lon;
	onPointerDownLat = lat;
	//Decide whether it is click or movement(gaze change) by subsequent action
	document.addEventListener( buttonMove, onDocumentMouseMove, false );
	document.addEventListener( buttonEnd, onDocumentMouseUp, false );
}

//Gaze change
function onDocumentMouseMove( event ) {
	//move_count increases while moving
	if(move_count >=2){
		click_link = "";
	}
	move_count++;
	X=0;
	Y=0;
	//get the position clicked or touched
	if(getDevice =="pc"){
		event.preventDefault();
		X = event.clientX;
		Y = event.clientY;
	}
	else{
		X = event.changedTouches[0].clientX;
		Y = event.changedTouches[0].clientY;
	}
	//change the camera direction
	lon = ( X - onPointerDownPointerX ) * -0.1 + onPointerDownLon;
	lat = ( Y - onPointerDownPointerY ) * -0.1 + onPointerDownLat;
}

//when user clicked
function onDocumentMouseUp( event ) {
	move_count = 0;
	//if user clicks an object
	if(click_action_dic[click_link]){
		click_action_dic[click_link]();
		click_link = "";
	}
	document.removeEventListener( buttonMove, onDocumentMouseMove, false );
	document.removeEventListener( buttonEnd, onDocumentMouseUp, false );
}


//camera angle of view
function onDocumentMouseWheel( event ) {
	var fov = camera.fov + event.deltaY * 0.05;
	camera.fov = THREE.Math.clamp( fov, 10, 75 );
	camera.updateProjectionMatrix();
}

// update animation
function animate() {
	//auto move(moveflag == 0) or user's move(moveflag == 1)
	if(moveflag == 0){
		setTimeout(function() {
			requestAnimationFrame(animate);
		}, 1000 / fps);
	}else{
		requestAnimationFrame( animate );
	}
	render();
}


function render() {
	//auto move(moveflag == 0) or user's move(moveflag == 1)
	if(moveflag == 0){
		lon += .15;
	}
	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = THREE.Math.degToRad( 90 - lat );
	theta = THREE.Math.degToRad( lon );
	camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
	camera.position.y = 100 * Math.cos( phi );
	camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );
	camera.lookAt( scene.position );
	sphere.visible = false;
	sphere.visible = true;
	if(getDevice == 'sp' && arflag == 1){
		controls.update();
	}	
	renderer.render(scene, camera);
}


window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}, false );
