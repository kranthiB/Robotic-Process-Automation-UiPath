var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy'); 
const fileUpload = require('express-fileupload');
var port = process.env.PORT || 8999;
var app = express();

// app.use(fileUpload());
app.use('/images', express.static(__dirname +'/images'));
app.use(fileUpload());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');  
require('./routes.js')(app);

app.listen(port);
console.log('Node listening on port %s', port);
