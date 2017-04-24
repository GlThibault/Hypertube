const imdbapi = require('imdb-api');
const service = {};
const movieTitle = require('movie-title');

service.imdb = imdb;

module.exports = service;

function imdb(results) {
  let title = "";
  results.forEach((element, index) => {
    // element.index = index;
    // element.index = index;
    title = movieTitle(element.name);
    let imdbinfo = imdbapi.get(title);
    // imdbapi.getReq({
    //   name: title
    // }, (err, res) => {
    //   imdbinfo = res;
    // });
    console.log(imdbinfo);
    return element;
  }, this);
  // console.log(results);
  return results;
}
