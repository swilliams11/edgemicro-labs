var express = require('express'),
    fs =    require('fs'),       // required to read certs and keys
    https = require('https');
var config = require('./config.js'); //config file contains all tokens and other private info
var app = express();

var options = {
    //key:    fs.readFileSync('../keys/twoway_private.pem', 'utf8'),
    //cert:   fs.readFileSync('../keys/twoway_mycert.cert', 'utf8'),
    //ca:     fs.readFileSync('../keys/client_cert.cert'), //this is the client Certificate
    key:    fs.readFileSync('../keys/server/server-key.pem', 'utf8'),
    cert:   fs.readFileSync('../keys/server/server-crt.pem', 'utf8'),
    ca:     fs.readFileSync('../keys/ca/intermediate/certs/ca-chain-cert.pem'), //this is the client Certificate
    passphrase: 'test',
    requestCert:        true, // tells node that client must present certificate as well
    rejectUnauthorized: false // tell node that it should reject the request if cert is not presented
    //this is set to false so we can handle the rejection in the code below
};


//===============EXPRESS=================
// Configure Express
//app.use(express.logger());
//app.use(app.router);


//===============ROUTES=================
//displays our homepage
app.get('/hello-two', function(req, res){
  if (req.client.authorized) {
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end('{"status":"approved"}');
  } else {
      res.writeHead(401, {"Content-Type": "application/json"});
      res.end('{"status":"invalid certificate presented - access denied"}');
  }
  //res.send({"hello": "world"});
});

httpsServer = https.createServer(options, app);

//===============PORT=================
var port = 9443;
httpsServer.listen(port);
//app.listen(port);
console.log("listening on " + port + "!");
