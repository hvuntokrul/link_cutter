var express = require('express');
var app = express();
var port = process.env.PORT || 8080; //for Heroku
var valid = require('validator');
var mClient = require('mongodb').MongoClient;
//import function for creating new short links and adding to DB
var createNewLink = require('./link');
//make DB access link safe
var dbUrl = process.env.MONGOLAB_URI;

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

  mClient.connect(dbUrl, function (err, db){
    if (err) throw err;
    
    var colln = db.collection('links');
    createNewLink(url, colln, db, res);
  });
  next();
});

app.get('/api/:url(*)', function(req, res){
});

app.param('sLink', function(req, res, next, sLink){
  
  mClient.connect(dbUrl, function (err, db){
    if (err) throw err;
    //try to find short link in the DB
    db.collection('links')
    .findOne({short : sLink})
    .then(function(data){
      //if found
      if (data !== null)
        res.redirect(data.original);
      //if not found
      else
        res.json({'error' : 'short link not found, please retry'});
      
      db.close();
    });
  });
  next();
});

//respond to get requests with short links
app.get('/:sLink', function(req, res){
});

//start server
app.listen(port, function () {
  console.log('Link shortener app listening on port ' + port);
});
