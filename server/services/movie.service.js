const imdbapi = require('imdb-api');
const service = {};
const tnp = require('torrent-name-parser');

const search = (title, callback) => {
  imdbapi.getReq({ name: title }, (err, things) => {
    if (things)
      callback(things);
  });
}

service.imdb = (results, callback) => {
  results.forEach((element) => {
    element.title = tnp(element.name.replace(/season |saison /gi, "S"));
    if (element.title)
      search(element.title.title, data => element.imdb = data);
  });
  setTimeout(() => callback(results), 1000);
}

module.exports = service;
