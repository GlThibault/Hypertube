'use strict';

const service = {};
const imdb = require('imdb-api');
const tnp = require('torrent-name-parser');

const search = (element) => {
  return new Promise(resolve => {
    imdb.getReq({
      name: element.title.title,
      opts: {
        apiKey: '1fdc329a'
      }
    }, (err, things) => {
      if (things)
        resolve(things);
      else
        resolve(err);
    });
  });
};

service.imdb = (results) => {
  return new Promise(resolve => {
    let i = 0;
    if (!results || results.length === 0) {
      resolve(null);
    } else {
      results.forEach((element) => {
        if (!element.source)
          element.source = 'tpb';
        element.title = tnp(element.name.replace(/season |saison /gi, 'S'));
        search(element)
          .then(data => {
            if (data.name != 'imdb api error')
              element.imdb = data;
            i++;
            if (element.title && element.title.year)
              element.year = element.title.year;
            else if (element.imdb && element.imdb.year)
              element.year = element.imdb.year;
            else if (element.imdb && element.imdb.start_year)
              element.year = element.imdb.start_year;
            if (!element.year)
              element.year = 1;
            if (i === results.length)
              resolve(results);
          });
      });
      setTimeout(() => {
        resolve(results);
      }, 2500);
    }
  });
};

module.exports = service;