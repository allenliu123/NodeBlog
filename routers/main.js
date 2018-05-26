var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');

router.get('/', function(req, res){

	Category.find().then(function(categories){

		Content.find().populate(['category','user']).then(function(contents){
			res.render('main/index.html',{
				userInfo: req.userInfo,
				categories: categories,
				contents: contents
			});
		});

	});
});

module.exports = router;
