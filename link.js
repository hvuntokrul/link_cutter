//make new short link and add to DB
module.exports = function createNewLink(URL, collection, DB, RES) {
  
  var newLink = (Math.floor(Math.random() * 10000)).toString(10);
  collection
    .find({ short: newLink })
    .count()
    .then(function(value) {
      if (value !== 0) {
        console.log('already there');
        createNewLink(URL, collection, DB, RES);
      } 
      else {
        var entry = {
          'original' : URL,
          'short' : newLink
        };
        console.log('inserted new entry ' + newLink);
        collection.insert(entry);
        RES.json({'original' : entry.original, 'short' : 'https://backend-hvuntokrul.c9users.io/' + entry.short});
        DB.close();
      }
  });
}