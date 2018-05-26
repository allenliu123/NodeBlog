var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Cookies = require('cookies');
var User = require('./models/User')
var app = express();

app.engine('html',swig.renderFile);

app.set('views','./views');

app.set('view engine','html');

swig.setDefaults({cache:false});

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next){
	req.cookies = new Cookies(req, res);
	req.userInfo = {};
	if(req.cookies.get('userinfo')){
		try{
			req.userInfo = JSON.parse(req.cookies.get('userinfo'));

			User.findById(req.userInfo._id).then(function(userinfo){
				req.userInfo.isAdmin = Boolean(userinfo.isAdmin);
				next();
			})

		} catch(e){
			next();
		}
	}
	else{
		next();
	}
});

app.use('/public',express.static( __dirname + '/public'));

app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

//url:  mongodb://username:password@localhost:27017/your_data_base
mongoose.connect('mongodb://nodeblog:nodeblog@localhost:27018/nodeblog',function(err){
	if(err){
		console.log('fail to connect database');
	} else {
		console.log('success connect database');
		app.listen(8080);
	}
});

// app.get('/',function(req, res, next){

// 	// res.send('<a href="https://www.baidu.com">aaa</a>')

// 	res.render('index');
// });
