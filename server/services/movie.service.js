const imdbapi = require('imdb-api');
const service = {};
const movieTitle = require('movie-title');

service.imdb = imdb;

module.exports = service;

function imdb(results) {
  let title = "";
  results.forEach((element, index) => {
    title = movieTitle(element.name);
    imdbapi.getReq({
      name: title
    }, (err, res) => {
      if (res)
        element[poster] = res.poster;
      // if (res.poster)
        // console.log(res.poster)
    });
  }, this);
  console.log(test);
  // console.log(results);
  return results;
}
