var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category'
	},

	title: String,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	addTime: {
		type: Date,
		default: new Date()
	},

	views: {
		type: Number,
		default: 0
	},

	description: {
		type: String,
		default: 'default'
	},

	content: {
		type: String,
		default: 'default'
	},

	comments: {
		type: Array,
		default: []
	}
});