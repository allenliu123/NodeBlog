var express = require('express');
var router = express.Router();
var User = require('../models/User')

var responseData;

// 统一返回格式
router.use(function(req, res, next){
	responseData = {
		code: 0,
		message: ''
	}
	next();
});

router.post('/user/register', function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;

	if(username == ''){
		responseData.code = 1;
		responseData.message = '用户名不能为空';
		res.json(responseData);
		return;
	}
	if(password == ''){
		responseData.code = 2;
		responseData.message = '密码不能为空';
		res.json(responseData);
		return;
	}
	if(password != repassword){
		responseData.code = 3;
		responseData.message = '两次密码输入不一致';
		res.json(responseData);
		return;
	}

	User.findOne({
		username: username
	}).then(function(userinfo){
		if(userinfo){
			responseData.code = 4;
			responseData.message = '该用户名已被注册'
		}
		else{
			var user = new User({
				username: username,
				password: password
			});
			user.save();
			responseData.message = '注册成功';
		}
		res.json(responseData);
	})
});

router.post('/user/login', function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
	User.findOne({
		username: username,
		password:password
	}).then(function(userinfo){
		if(userinfo){
			responseData.message = '登录成功';
			responseData.userinfo = {
				_id:  userinfo._id,
				username: userinfo.username
			}
			req.cookies.set('userinfo',JSON.stringify({
				_id:  userinfo._id,
				username: userinfo.username
			}));
			res.json(responseData);
		} else {
			responseData.code = 5;
			responseData.message = '用户名或密码错误';
			res.json(responseData);

		}
	});
});

router.get('/user/logout', function(req,res){
	req.cookies.set('userinfo', null);
	res.json(responseData);
});

module.exports = router;
