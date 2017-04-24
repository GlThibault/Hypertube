const imdbapi = require('imdb-api');
const service = {};
const movieTitle = require('movie-title');

service.imdb = imdb;

module.exports = service;

function imdb(results) {
  let title = "";
  results.forEach((element, index) => {
    console.log('-------' + index + '--------');
    console.log(element);
    title = movieTitle(element.name);
    // console.log(title);
    imdbapi.getReq({
      name: title
    }, (err, res) => {
      if (res){
        // console.log(element.name);
        // console.log(res.poster)
        element.push(["poster", res.poster]);
      // element.poster = res.poster
    }
        // element[poster] = res.poster;
        // console.log(res.poster)
      // if (res.poster)
        // console.log(res.poster)
    });
  }, this);
  // console.log(test);
  console.log(results);
  return results;
}
