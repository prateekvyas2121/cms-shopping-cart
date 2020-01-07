const mongoose = require('mongoose');

// category schema
var category_schema = mongoose.Schema({
	title:{
		type:String,
		required:true
	},
	slug:{
		type:String
	}
	
});

var Category = module.exports = mongoose.model('Category',category_schema);