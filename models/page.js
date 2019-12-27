const mongoose = require('mongoose');

// page schema
var page_schema = mongoose.Schema({
	title:{
		type:String,
		required:true
	},
	slug:{
		type:String
	},
	content:{
		type:String,
		required:true
	},
	sorting:{
		type:Number,
	}
	
});

var Page = module.exports = mongoose.model('Page',page_schema);