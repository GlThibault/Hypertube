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
  let end = 0;
  if (results.length === 0) {
    end = 1;
    callback(results);
  }
  results.forEach((element) => {
    if (element.title)
      element.name = element.title;
    element.title = tnp(element.name.replace(/season |saison /gi, 'S'));
    search(element, data => {
      if (data.name != 'imdb api error')
        element.imdb = data;
      i++;
      if (i === results.length) {
        end = 1;
        callback(results);
      }
    });
  });
  setTimeout(() => {
    if (end === 0) callback(results);
  }, 2500);
};

module.exports = service;