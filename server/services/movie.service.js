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
  let title = "";
  let tmp;
  let movie;
  results.forEach((element, index) => {
    tmp = element.name.replace(/season |saison /gi, "S");
    title = tnp(tmp);
    element.title = title;
    if (title)
      search(title.title, data => element.imdb = data);
  });
  setTimeout(() => callback(results), 1000);
}

module.exports = service;
