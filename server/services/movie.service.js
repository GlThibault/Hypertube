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
    // if (element.title) {
    //   element.link = element.infoUrl;
    //   element.id = element.infoUrl.replace('https://isohunt.to/torrent_details/', '');
    //   element.id = element.id.substring(0, element.id.indexOf('/')) + '&source=isoh';
    element.name = element.title;
    // } else
    //   element.id = element.id + '&source=tpb';
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