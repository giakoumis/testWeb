var NodeWebCam = require("node-webcam");


//Default options 
 
var opts = {
 
    width: 1280,
 
    height: 720,
 
    delay: 1,
 
    quality: 100,
 
    output: "jpeg",
 
    verbose: true
 
}



module.exports = {

createCamera:function(){
	return NodeWebCam.create(opts);


},


takePicture:function(){
	var now = new Date();
	var name = "pictures/pic_" + now.getDate()+"_"+now.getMonth()+"_"+now.getYear()+"_"+now.getHours()+"_"+now.getMinutes();
	var Webcam = NodeWebCam.create(opts);
	//Webcam.capture(name+"__"+0);
	setTimeout(function(){
	Webcam.capture(name+"__"+1);
	},1000);
	setTimeout(function(){
	Webcam.capture(name+"__"+2);
	},5000);
	setTimeout(function(){
	Webcam.capture(name+"__"+3);
	},10000);
	setTimeout(function(){
	Webcam.capture(name+"__"+4);
	},15000);
	setTimeout(function(){
	Webcam.capture(name+"__"+5);
	},20000);
	setTimeout(function(){
	Webcam.capture(name+"__"+6);
	},25000);
	setTimeout(function(){
	Webcam.capture(name+"__"+7);
	},30000);
	setTimeout(function(){
	Webcam.capture(name+"__"+8);
	},35000);
}	



};
