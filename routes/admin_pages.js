const express = require('express');
const router = express.Router();
//get page model
const Page = require('../models/page')
/*
GET pages index
*/
router.get('/',(req,res) => {
	// res.send("_layouts/admin_index");
	Page.find().sort({sorting:1}).exec((error,pages) => {
		res.render('admin/pages',{
			pages:pages
		});

	});

});

/*
GET add page
*/
router.get('/add-page',(req,res) => {
	var title = "";
	var slug = "";
	var content = "";

	res.render("admin/add_page",{
		title:title,
		slug:slug,
		content:content
	});
});

/*
GET edit page
*/

router.get('/edit-page/:slug',(req,res) => {
	// res.send(req.params);
	// console.log(req.params);
	page = Page.findOne({slug:req.params.slug},(error,page) => {
		// res.send(page);
		res.render("admin/add_page",{
			title:page.title,
			slug:page.slug,
			content:page.content
		});
	})
	
	
});


/*
POST add page
*/
router.post('/add-page',(req,res) => {
	req.checkBody('title','Title must have a value.').notEmpty();
	req.checkBody('content','Content must have a value.').notEmpty();

	var title = req.body.title;
	var content = req.body.content;
	var slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
	if(slug == "") slug = title.replace(/\s+/g,'-').toLowerCase();	

	var errors = req.validationErrors();
	if (errors)
	{
		console.log("ther's a validation error =========>>>>>>>>",errors)
		res.render("admin/add_page",{
			errors:errors,
			title:title,
			slug:slug,
			content:content
		});
	}else{
		console.log("success");
		Page.findOne({slug: slug} , (error , page) => {
			if (page) {
				//if there's a page ...it means the slug is not unique 
				//therefore
				console.log(slug,"named slug already exist's");
				req.flash('danger',"Page slug already exist's choose another");
				res.render("admin/add_page",{
					title:title,
					slug:slug,
					content:content
				});
			}else{
				var page = new Page({
					title:title,
					content:content,
					slug:slug,
					sorting:0
				});

				page.save((error) => {
					if (error){
					console.log("data cannot be saved may be this was the issue ==========>>>>>>>>>"+error);
					}else{
						console.log("page added sucessfully saved !!!! hurrah")
						req.flash('success','page added bruhhhh!');
						res.redirect('/admin/pages');

					}
				});
			}
		});
	}

});


/*
POST reorder-pages index
*/
router.post('/reorder-page',(req,res) => {
	// console.log(req.body['id[]']);
	var ids = req.body['id[]'];
	var count = 0;
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		console.log('id =>',id);
		count++;
		console.log(count);
		(function (count) {
			console.log("inside function count =>",count,"|| id =>",id);
			Page.findById(id,(error,page) => {
				console.log("page name =>",page.title,"||","count => ",count);
				if(page.title == "home"){
					page.sorting = 0;
				}else{
				page.sorting = count;
				}
				page.save((error) => {
					if (error) {
						return console.log(error);
					}else{
						console.log("sucessfully reordered!!!!")
						console.log("Chal Gaya Bai Dekh Kya Raha hai......!!!!")
					}

				});

			});

		})(count);
	}
});

//EXPORTS
module.exports = router;