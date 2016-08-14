//server.js

//setup

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var app = express();
var GPIO = require('onoff').Gpio,
    led = new GPIO(24,'out');
var door = new GPIO(23,'in','both');
var arm_led = new GPIO(17,'out');
var alarm_armed;

//camera setup
var NodeWebcam = require( "node-webcam" );
 
 
//Default options 
 
var opts = {
 
    width: 1280,
 
    height: 720,
 
    delay: 0,
 
    quality: 100,
 
    output: "jpeg",
 
    verbose: true
 
}
 
var Webcam = NodeWebcam.create( opts );
 




//Pi Setup



function delayalarm(err,state){
        if (alarm_armed)
 {
	setTimeout(function(){
	if (alarm_armed)	
	{
	if (state ==1) {
		
		led.writeSync(0);
		console.log('The door is closed');
	}else {
		led.writeSync(1);
		Webcam.capture( "test_picture" );
		console.log('The door is open');
	}

}
	console.log('waited for password...');
	},10000);
 }	
}
    
 


function alarm(err,state){

	
	if (alarm_armed)	
	{
	if (state ==1) {
		
		led.writeSync(0);
		console.log('The door is closed');
	}else {
		led.writeSync(1);
		console.log('The door is open');
	}

}
}


door.watch(delayalarm);

//configuration

mongoose.connect('mongodb://localhost/HomeSecurity');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());


//define model

var EntryPoint = require('./models/entryPoint');
var Password = require('./models/password');
var AlarmStatus = require('./models/alarmStatus');



//start



//alarm functions

function alarmTurnOn(){
	AlarmStatus.find(function(err,alarm){
	    if (err)
	    	console.log(err)
	    	
	    console.log(alarm);	
	    alarm[0].status = true;
	    alarm[0].save(function(err){
	    	if (err)
	    	    console.log(err)
	    
	    alarm_armed=true;
	    arm_led.writeSync(1);
	    console.log("Alarm is armed");
	    });
	    
	    	
	});

}

function alarmTurnOff(){
	AlarmStatus.find(function(err,alarm){
	    if (err)
	    	console.log(err)
	    	
	    console.log(alarm);	
	    alarm[0].status = false;
	    alarm[0].save(function(err){
	    	if (err)
	    	    console.log(err)
	    
	    alarm_armed=false;
	    arm_led.writeSync(0);
	    led.writeSync(0);
	    console.log("Alarm is disarmed");
	    });
	    
	    	
	});

}

function setAlarmStatus(){
 
   AlarmStatus.find(function(err,alarm){
   	if (err)
   		console.log(err)
   		
   	alarm_armed = alarm[0].status;
   	if (alarm_armed) {
   	arm_led.writeSync(1);
   	console.log("The alarm is armed");
   	}else
   		console.log("The alarm is disarmed");
   	   	
   	
   });
   

}


//routes

app.get('/api/arm',function(req,res){
	if (!alarm_armed) {
//	alarm_armed = true;
//            arm_led.writeSync(1);
//            console.log('The alarm has been armed');
            alarmTurnOn();		
            res.json({message: 'Alarm Armed'});
	}else
	res.json({message: 'Alarm allready armed'});

});



app.get('/api/password/:pass',function(req,res){
    
    Password.find({pass:req.params.pass},function(err,password){
        if (err)
            res.send(err)
            
            if(password[0]){
            alarmTurnOff();
        //    alarm_armed = false;
        //    arm_led.writeSync(0);
        //    console.log('The alarm has been disarmed');
        
            res.json({message:'OK'});
            }else
               res.json({message:'Wrong'});
    });
});


app.post('/api/password',function(req,res){
    Password.create({pass:req.body.pass},function(err,password){
        if (err)
            res.send(err)
            
            res.json({message:'Password created'});
    });
    
});

app.post('/api/arm',function(req,res){
    AlarmStatus.create({name:req.body.name},function(err,alarmStatus){
        if (err)
            res.send(err)
            
            res.json({message:'Password created'});
    });
    
});



app.get('/api/entrypoints', function(req,res){
    
    EntryPoint.find(function(err,entrypoints){
        
        if (err)
            res.send(err)
            
            res.json(entrypoints);
    });
    
});

app.post('/api/entrypoints',function(req,res){
   var entryPoint= new EntryPoint();
   	entryPoint.name = req.body.name;
   	entryPoint.secure= req.body.secure;
   
   entryPoint.save(function(err){
   	if (err)
   		res.send(err);
   		
   		res.json({message: 'EntryPoint Created'});
    
    });
});

app.put('/api/entrypoints/:name',function(req,res){
    EntryPoint.find({name:req.params.name},function(err,entrypoint){
        if (err)
            res.send(err)
            
            entrypoint[0].secure = req.body.secure;
            
            entrypoint[0].save(function(err){
                if (err)
                    res.send(err)
                    
                    res.json({message:'The entrypoint is updated'})
            })
    })
    
})

app.get('*',function(req,res){
    res.sendFile(__dirname+ '/public/index.html');
})



//setup closing

process.on('SIGINT',function(){
	console.log("\nGracefully shutting down");
	
	console.log("Realising the pi..." );
	led.unexport();
	arm_led.unexport();
	door.unexport();
	
	process.exit();
	
	
	
});

//start

setAlarmStatus();



//listen

app.listen(3000);
console.log("App is listening on port 8080");




