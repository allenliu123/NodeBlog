var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function(req, res, next){
	data = {
		userInfo: req.userInfo,
		category: req.query.category || ''
		
	};
	Category.find().then(function(categories){
		data.categories = categories;

	});
	next();
});

router.get('/', function(req, res){
	var where = {};
	if(data.category){
		where.category = data.category;
	}
	Content.where(where).find().populate(['category','user']).then(function(contents){
		data.contents = contents;
		res.render('main/index.html', data);
	});
});

router.get('/view', function(req, res){
	contentid = req.query.contentid || '';
	Content.findOne({_id: contentid}).then(function(content){
		if(content){
			data.content = content;

			content.views++;
			content.save();
			res.render('main/view', data);
		}else{}

	});
});

module.exports = router;
