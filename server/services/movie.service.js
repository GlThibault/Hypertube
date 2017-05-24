'use strict';

const imdb = require('imdb-api');
const service = {};
const tnp = require('torrent-name-parser');

const search = (element, callback) => {
  imdb.getReq({
    name: element.title.title,
    opts: {
      apiKey: '1fdc329a'
    }
  }, (err, things) => {
    if (things)
      callback(things);
    else
      callback(err);
  });
};

service.imdb = (results, callback) => {
  let i = 0;
  if (results.length === 0)
    callback(results);
  results.forEach((element) => {
    element.title = tnp(element.name.replace(/season |saison /gi, 'S'));
    search(element, data => {
      if (data.name != 'imdb api error')
        element.imdb = data;
      i++;
      if (i === results.length)
        callback(results);
    });
  });
};

module.exports = service;