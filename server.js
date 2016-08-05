//server.js

//setup

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var app = express();


//configuration

mongoose.connect('mongodb://localhost/test');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());


//define model

var EntryPoint = mongoose.model('EntryPoint',{
    name:String,
    secure:Boolean
});


var Password = mongoose.model('Password',{
    pass:String
});
//routes


app.get('/api/password/:pass',function(req,res){
    
    Password.find({pass:req.params.pass},function(err,password){
        if (err)
            res.send(err)
            
            res.json(password);
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
    EntryPoint.create({
        name:req.body.name,
        secure:req.body.secure
    },function(err, entrypoint){
        
        if (err)
            res.send(err)
            
            res.json({message:'Entry Point created'});
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

//listen

app.listen(3000);
console.log("App is listening on port 8080");