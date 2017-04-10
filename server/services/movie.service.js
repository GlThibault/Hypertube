var imdbapi = require('imdb-api');
var service = {};
var movieTitle = require('movie-title');

service.imdb = imdb;

module.exports = service;

function imdb(results) {
  var title = "";
  results.forEach(function (element, index) {
    title = movieTitle(element.name);
    // console.log(title);
    imdbapi.getReq({
      name: title
    }, (err, res) => {
      if (res)
        element[poster] = res.poster;
      // console.log(res.poster)
    });
  }, this);
  console.log(results);
  return results;
}
