//make new short link and add to DB
module.exports = function createNewLink(URL, collection, DB, RES) {
  
  var newLink = (Math.floor(Math.random() * 10000)).toString(10);
  collection
    .find({ short: newLink })
    .count()
    //check if this short link is already in the db
    .then(function(value) {
      //if already there and something was found
      if (value !== 0) {
        //run function again recursively
        createNewLink(URL, collection, DB, RES);
      } 
      //if not - make new DB entry, send response to client and close DB
      else {
        var entry = {
          'original' : URL,
          'short' : newLink
        };
        collection.insert(entry);
        RES.json({'original' : entry.original, 'short' : 'https://fcc-link.herokuapp.com/' + entry.short});
        DB.close();
      }
  });
};