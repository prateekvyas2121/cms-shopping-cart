const express = require('express');
const path = require('path')
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
var flash = require('connect-flash');
const expressValidator = require('express-validator');
//initialize app 
const app = express();
const config = require('./config/database');
const url = config.database;
const bodyParser = require('body-parser');//this module is used to get the form data
//we use middleware so that any time client hits any request we gonna use body parser to parse that data
app.use(bodyParser.json());
mongoose.connect(url,{ 
		useNewUrlParser: true,
		useUnifiedTopology: true 
	},
	(error,db) =>{
	if (error) {
		console.log("this is the errrorrrrrrrrrrr =========>>>>>>>>>",error);
	}
	else{
		console.log("connected to database");
	}
});


 //VIEW ENGINE SETUP
 app.set('views',path.join(__dirname,'views'));
 app.set('view engine','ejs');

 //SETUP  PUBLIC FOLDER
 app.use(express.static(path.join(__dirname,'public')));

//BODY PARSER MIDDLE WARE
app.use(bodyParser.urlencoded({ extended:false }));

app.use(bodyParser.json());

//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

//express validor middleware
app.use(expressValidator({
	errorFormatter: function(param,msg,value){
		var namespace = param.split(','),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}

		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));
//set global errors variable 
app.locals.errors = null;
//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//setup user routes
const pages = require('./routes/pages.js');
app.use('/',pages);

//setup admin routes
const admin_pages = require('./routes/admin_pages.js');
app.use('/admin/pages',admin_pages);

//START THE SERVER
const PORT = 3000;
app.listen(PORT,() => {
	console.log("server started at PORT " + PORT)
});