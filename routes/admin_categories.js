const express = require('express');
const router = express.Router();
//get category model
const Category = require('../models/category');
// var ObjectID = require('mongodb').ObjectID;
const ObjectId = require('mongodb').ObjectID;
//GET /categories 
router.get('/',(req,res) => {
	// res.send("categories here");
	Category.find().exec((error,categories) => {
		if(error) throw error;
		res.render("admin/categories",{
			categories:categories
		});
	});
});

//GET ADD CATEGORY PAGE
router.get('/add-category',(req,res) => {
	var title = '';
	var slug = '';
	res.render('admin/add_category',{
		title:title,
		slug:slug
	});

});

//GET EDIT CATEGORY PAGE
router.get('/edit-category/:slug',(req,res) => {
	// res.send(req.params);
	// console.log(req.params);
	Category.findOne({slug:req.params.slug},(error,category) => {
		// res.send(ObjectId(category._id));
		res.render('admin/add_category',{
			title:category.title,
			slug:category.slug,
			id:category._id
		});
	});
	
});
//PATCH CATEGORY
router.post('/edit-category/:slug',  (req,res) =>{
 	// res.send(req.body.id);
 	// console.log(ObjectId (req.body.id))

 	var category = Category.findOne({_id:req.body.id},(error,category) => {
 		// res.send(category);
 		category.title = req.body.title;
 		category.slug  = req.body.slug;
 		category.save();
 		// res.send({
	 	// 			category:
		 // 				{
		 // 					title: category.title,
		 // 					slug: category.slug
		 // 				}
	 	// 		});

	 	res.redirect("/admin/categories");
 	});
 });


//POST CATEGORY
router.post('/add-category',(req,res) => {
	console.log("post route hits =========>>>>>>>>>"+ req.url);
	req.checkBody('title','Title must have a value.').notEmpty();
	// req.checkBody('slug','Slug must have a value.').notEmpty();
	var errors = req.validationErrors();
	// console.log(errors)
	var title = req.body.title;
	var id    = "";
	var slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
	if(slug == "") slug = title.replace(/\s+/g,'-').toLowerCase();	

	if (errors)
	{
		console.log("ther's a validation error =========>>>>>>>>",errors)
		res.render("admin/add_category",{
			errors:errors,
			title:title,
			slug:slug,
			id:id
		});
	}else{
		var category = new Category({
					title:title,
					slug:slug
				});
		category.save((error) => {
					if (error){
					console.log("data cannot be saved may be this was the issue ==========>>>>>>>>>"+error);
					}else{
						console.log("category added sucessfully saved !!!! hurrah")
						req.flash('success','page added bruhhhh!');
						res.redirect('/admin/categories');

					}
				});
	}

});
//EXPORTS
module.exports = router;