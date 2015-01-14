var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongoskin');
var db = mongo.db('mongodb://localhost/27017/arter');
var bodyParser = require('body-parser');

app.set('views', './views')
	.set('view engine', 'jade');

app.use(express.static(__dirname + '/assets'))
	.use( bodyParser.json() )       // to support JSON-encoded bodies
	.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  		extended: true
	}))
	.use(function(req,res,next){
		req.db=db;
		next();
	});  


app.get('/',function(req,res){
	res.render('index');
})
.get('/stream',function(req,res){
	var db=req.db;
	var items=[];
	db.collection('posts').find().toArray(function(err,item){
		res.json(item);
	});
	return;
	
	db.collection('posts').find().toArray(function (err, items) {
		if (err) throw err;
		//posts.each(function(err,item){
			//if(err)throw err;
			//if(item==null)return;
			for(var i in items){
				var item=items[i];
				db.collection('users').find({_id:item.userID}).toArray(function(err,user){
					if(err)throw err;
					console.log(user);
					item.name=user.name;
					res.json(item);
				});
			}
		//});
    });
})
.post('/user/status',function(req,res){
	if(req.body.socialID != undefined && req.body.social != undefined){
		var db=req.db;
		var u=req.body;
		var search={};
		search['social.'+u.social]=u.socialID;
		var user=null;
		db.collection('users').findOne(search,function(err,result){
			if(err)throw err;
			if(result==null){
				console.log('adding new user');
				user={'name':u.name,'email':u.email,'avatar':u.image,'social':{}};
				user.social[u.social]=u.socialID;
				db.collection('users').insert(user,function(err,result){
					if(err)throw err;
					res.json(user);
				});
			}
			else res.json(result);
		});
	}
})
.post('/user/post',function(req,res){
	var db=req.db;
	var p=req.body;
	db.collection('posts').insert(p,function(err,result){
		if(err)throw err;
		res.json(result);
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
