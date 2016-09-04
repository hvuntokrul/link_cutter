var express = require('express');
var app = express();
var port = process.env.PORT || 8080; //for Heroku
var valid = require('validator');
var mClient = require('mongodb').MongoClient;
var createNewLink = require('./link');

//answer to homepage requests
app.use('/', express.static(__dirname + '/public'));

//answer get requests to the api
app.param('url', function (req, res, next, url){
  //validator settings
  var valSettings = {
    'require_protocol' : true
  };
  //reject if link does not comply with spec
  if (!valid.isURL(url, valSettings)){
    res.json({'error' : 'wrong ulr format, please retry'});
    return;
  } 
  
  var dbUrl = process.env.MONGOLAB_URI;

  mClient.connect(dbUrl, function (err, db){
    if (err) throw err;
    
    var colln = db.collection('links');
    createNewLink(url, colln, db, res);
  });
  next();
});

app.get('/api/:url(*)', function(req, res){
});

//start server
app.listen(port, function () {
  console.log('Link shortener app listening on port ' + port);
});
