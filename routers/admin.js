var express = require('express');

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

var router = express.Router();

router.use(function(req, res, next){
	if(!req.userInfo.isAdmin){
		res.send("error");
		return;
		next();
	}
	next();
});

router.get('/', function(req, res){
	res.render("admin/index.html",{
		userInfo: req.userInfo
	});

});

router.get('/user', function(req, res){

	var page = Number(req.query.page || 1);
	var limit = 6;
	var skip = (page - 1) * limit;

	User.count().then(function(count){
		var pages = Math.ceil(count / limit);
		var array = new Array();
		for (var i = 0; i < pages; i++) {
			array[i] = i + 1;
		}
		User.find().sort({_id: -1}).limit(limit).skip(skip).then(function(users){
			res.render("admin/user_index.html",{
				userInfo: req.userInfo,
				users: users,
				page: page,
				pages: pages,
				array: array
			});
		});
	});
});

router.get('/category', function(req, res){
	var page = Number(req.query.page || 1);
	var limit = 3;
	var skip = (page - 1) * limit;

	Category.count().then(function(count){

		Category.find().sort({_id: -1}).then(function(categories){
			res.render("admin/category_index.html",{
				userInfo: req.userInfo,
				categories: categories
			});
		});
	});

});

router.get('/category/add', function(req, res){
	res.render('admin/category_add.html',{
		userInfo: req.userInfo
	});

});

router.post('/category/add', function(req, res){
	var name = req.body.name || '';
	if(name == ''){
		res.render('admin/error.html',{
			userInfo: req.userInfo,
			message: '名称不能为空'
		});
		return;
	}
	Category.findOne({
		name: name
	}).then(function(rs){
		if(rs){
			res.render('admin/error.html',{
				userInfo: req.userInfo,
				message: '该名称已经存在'
			});
			return;
		} else {
			return new Category({
				name: name
			}).save();
		}
	}).then(function(newCategory){
		res.render('admin/success.html',{
			userInfo: req.userInfo,
			message: '分类保存成功',
			url: '/admin/category'
		})
	});

});

router.get('/category/edit', function(req, res){
	var id = req.query.id || '';
	Category.findOne({
		_id: id
	}).then(function(category){
		if(!category){
			res.render('admin/error',{
				userInfo: req.userInfo,
				message: '分类信息不存在'
			});
		} else {
			res.render('admin/category_edit', {
				userInfo: req.userInfo,
				category: category
			});
		}
	});
});

router.post('/category/edit', function(req, res){
	var id = req.query.id || '';
	var name = req.body.name || '';

	Category.findOne({
		_id: id
	}).then(function(category){
		if(!category){
			res.render('admin/error',{
				userInfo: req.userInfo,
				message: '分类信息不存在'
			});
			return Promise.reject();
		} else {
			if(name == category.name){
				res.render('admin/success.html',{
					userInfo: req.userInfo,
					message: '分类保存成功',
					url: '/admin/category'
				})
				return Promise.reject();
			} else {
				return Category.findOne({
					_id: {$ne: id},
					name: name
				});
			}
		}
	}).then(function(sameCategory){
		if(sameCategory){
			res.render('admin/error',{
				userInfo: req.userInfo,
				message: '该名称已经存在'
			});
			return Promise.reject();
		} else {
			return Category.update({
				_id: id
			},{
				name: name
			})
		}
	}).then(function(){
		res.render('admin/success.html',{
			userInfo: req.userInfo,
			message: '分类修改成功',
			url: '/admin/category'
		},function(){})
	},function(){});
});

router.get('/category/delete', function(req, res){
	var id = req.query.id || '';
	Category.findOne({
		_id: id
	}).then(function(category){
		if(!category){
			res.render('admin/error',{
				userInfo: req.userInfo,
				message: '分类信息不存在'
			});
		} else {
			return Category.remove({
				_id: id
			}).then(function(){
				res.render('admin/success.html',{
					userInfo: req.userInfo,
					message: '分类delete成功',
					url: '/admin/category'
				})
			});
		}
	})
});

router.get('/content', function(req, res){
	var page = Number(req.query.page || 1);
	var limit = 3;
	var skip = (page - 1) * limit;

	Content.count().then(function(count){
		var pages = Math.ceil(count / limit);
		var array = new Array();
		for (var i = 0; i < pages; i++) {
			array[i] = i + 1;
		}
		Content.find().limit(limit).skip(skip).populate(['category','user']).then(function(contents){
			res.render("admin/content_index.html",{
				userInfo: req.userInfo,
				contents: contents,
				page: page,
				pages: pages,
				array: array
			});
		});
	});
});

router.get('/content/add', function(req, res){
	Category.find().then(function(categories){
		res.render('admin/content_add.html',{
			userInfo: req.userInfo,
			categories: categories
		})
	});
});

router.post('/content/add', function(req, res){

	if(req.body.category == ''){
		res.render('admin/error',{
			userInfo: req.userInfo,
			message: '分类不能为空'
		});
		return;
	}

	if(req.body.title == ''){
		res.render('admin/error',{
			userInfo: req.userInfo,
			message: 'title不能为空'
		});
		return;
	}

	new Content({
		category: req.body.category,
		title: req.body.title,
		user: req.userInfo._id.toString(),
		description: req.body.description,
		content: req.body.content
	}).save().then(function(){
		res.render('admin/success',{
			userInfo: req.userInfo,
			message: 'content save 成功',
			url: '/admin/content'
		})
	})
});

router.get('/content/edit', function(req, res){
	var id = req.query.id || '';

	Category.find().then(function(categories){

		Content.findOne({
			_id: id
		}).populate('category').then(function(content) {
			if (!content) {
				res.render('admin/error', {
					userInfo: req.userInfo,
					message: '分类信息不存在',
				});
			} else {
				res.render('admin/content_edit.html', {
					userInfo: req.userInfo,
					content: content,
					categories:categories
				})
			}
		})
	});
});

router.post('/content/edit', function(req, res){
	var id = req.query.id || '';

	if(req.body.category == ''){
		res.render('admin/error',{
			userInfo: req.userInfo,
			message: '分类不能为空'
		});
		return;
	}

	if(req.body.title == ''){
		res.render('admin/error',{
			userInfo: req.userInfo,
			message: 'title不能为空'
		});
		return;
	}

	Content.update({
		_id: id
	},{
		category: req.body.category,
		title: req.body.title,
		description: req.body.description,
		content: req.body.content
	}).then(function(){
		res.render('admin/success',{
			userInfo: req.userInfo,
			message: 'content edit 成功',
			url: '/admin/content'
		})
	});
});

router.get('/content/delete', function(req, res){
	var id = req.query.id || '';
	Content.findOne({
		_id: id
	}).then(function(content){
		if(!content){
			res.render('admin/error',{
				userInfo: req.userInfo,
				message: '分类信息不存在'
			});
		} else {
			return Content.remove({
				_id: id
			}).then(function(){
				res.render('admin/success.html',{
					userInfo: req.userInfo,
					message: '分类delete成功',
					url: '/admin/content'
				})
			});
		}
	})
});

module.exports = router;
