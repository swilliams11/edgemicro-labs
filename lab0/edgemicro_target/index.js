var express = require('express'),
    http = require('http'),
    https = require('https');
var config = require('./config.js'); //config file contains all tokens and other private info
var app = express();


//===============EXPRESS=================
// Configure Express
//app.use(express.logger());
//app.use(app.router);


//===============ROUTES=================
//displays our homepage
app.get('/hello', function(req, res){
  res.send({"hello": "world"});
});

//===============PORT=================
var port = 8090;
app.listen(port);
console.log("listening on " + port + "!");
