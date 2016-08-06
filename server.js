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

//Pi Setup

//led.writeSync(1);

function alarm(err,state){
	if (state ==1) {
	
		led.writeSync(0);
		console.log('The door is closed');
	}else {
		led.writeSync(1);
		console.log('The door is open');
	}


}


door.watch(alarm);

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

//routes


app.get('/api/password/:pass',function(req,res){
    
    Password.find({pass:req.params.pass},function(err,password){
        if (err)
            res.send(err)
            
            if(password[0]){
            
            led.writeSync(1);
            
            }
            res.json(password[0]);
    });
});


app.post('/api/password',function(req,res){
    Password.create({pass:req.body.pass},function(err,password){
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
	door.unexport();
	
	process.exit();
	
	
	
});



//listen

app.listen(3000);
console.log("App is listening on port 8080");




