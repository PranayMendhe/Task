var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var mongojs=require('mongojs');
var db=mongojs('localhost:27017/Projects',['users','project'])

var superadmin=require('./routes/superadmin');
var users=require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

app.get('/',function(req,res){
  res.send("Hi this is Server...!");
});

// Routes For User
app.get('/user',users);
app.get('/userView',users);
app.get('/managerView',users);

// Routes For Superadmin
app.get('/superadmin',superadmin);
app.get('/superadmin/createProject',superadmin);
app.get('/superadmin/assign',superadmin);
app.get('/superadmin/managerAccess',superadmin);
app.get('/superadmin/managerRevoke',superadmin);
app.get('/superadmin/userDatabase',superadmin);
app.get('/superadmin/projectDatabase',superadmin);


app.listen(8000,function(req,res){
  console.log("Server running on port 8000");
});
module.exports = app;