var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongoskin');
var db = mongo.db('mongodb://localhost/27017/arter');

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/assets'));
app.use(function(req,res,next){
	req.db=db;
	next();
});

app.get('/',function(req,res){
	res.render('index');
});
app.get('/stream',function(req,res){
	var db=req.db;
	db.collection('users').find().toArray(function (err, items) {
		if (err) throw err;
		else res.json(items);        
    });
});

io.on('connection',function(socket){
	console.log('a user connected');
	socket.on('disconnect',function(){
		console.log('user disconnected');
	});
	socket.on('chat message',function(msg){
		io.emit('chat message',msg);
	});
});

http.listen(3000,function(){
	console.log('listening on 3000');
});
