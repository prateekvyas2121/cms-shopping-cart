const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
	res.render("index",{
		title: "User Area"
	});
});

//EXPORTS
module.exports = router;