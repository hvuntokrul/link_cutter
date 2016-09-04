var express = require('express');
var app = express();
var port = process.env.PORT || 8080; //for Heroku
var mClient = require('mongodb').MongoClient;

//answer to homepage requests
app.use('/', express.static(__dirname + '/public'));

//answer get requests to the api
app.param('url', function (req, res, next, url){
  
  //TO DO: reject if link does not comply with spec
  
  var dbUrl = process.env.MONGOLAB_URI;








/*

function co(generator) {
  let gen = generator();

  return (function iterate({value, done}) {
    if (done) {
      return value;
    }

    return value.then(x => iterate(gen.next(x)));
  })(gen.next());
}

const p = co(function*() {
  const response = yield fetch("https://jsonplaceholder.typicode.com/posts");
  const json = yield response.json();
  console.log(json[0]);
  return json;
});

*/


    /* OLDOLD OLD
   do {
      
      var newLink = 'https://backend-hvuntokrul.c9users.io/';
      newLink += Math.floor(Math.random() * 5);
      var check = colln.find({ short : newLink }).count();
   } while (check !== 0); //check if already in DB
    
    var entry = {
      'original' : url,
      'short' : newLink
    };
    
    colln.insert(entry);
    */




  mClient.connect(dbUrl, function (err, db){
    if (err) throw err;
    
    

    
    
    
    
    function createNewLink(URL) {
      var newLink = 'https://backend-hvuntokrul.c9users.io/';
      newLink += Math.floor(Math.random() * 5);
      colln
        .find({ short: newLink })
        .count()
        .then(function(value) {
          if (value !== 0) {
            console.log(value + ' already there');
            createNewLink(URL);
          } 
          else {
            var entry = {
              'original' : URL,
              'short' : newLink
            };
            console.log('inserted new entry ' + newLink);
            colln.insert(entry);
            db.close();
          }
      });
    }
    
    var colln = db.collection('links');
    
    createNewLink(url);
    
    
  });
  
  res.send('done');
  next();
});

app.get('/api/:url', function(req, res){
});

//start server
app.listen(port, function () {
  console.log('Link shortener app listening on port ' + port);
});
