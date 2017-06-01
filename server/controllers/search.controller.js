'use strict';

const express = require('express');
const router = express.Router();
const isohuntApi = require('isohunt-api');
const PirateBayAPI = require('thepiratebay');
const movieService = require('../services/movie.service');

const compare = (a, b) => {
  if (parseInt(a.seeders) < parseInt(b.seeders))
    return 1;
  if (parseInt(a.seeders) > parseInt(b.seeders))
    return -1;
  return 0;
};

const mySort = (tpb, isoh) => {
  isoh.forEach((element) => {
    tpb.push(element);
  }, this);
  tpb.sort(compare);
  return tpb;
};

router.post('/', (req, res) => {
  isohuntApi.search(req.body.searchquery.search, {
      category: 'movies',
      order: 'seeders'
    }).then(isohuntResults => {
      PirateBayAPI.search(req.body.searchquery.search, {
          category: 'movies',
          page: 0,
          orderBy: 'seeds',
          sortBy: 'desc'
        })
        .then(TPBResults => {
          movieService.imdb(mySort(TPBResults, isohuntResults), data => {
            res.send(data);
          });
        })
        .catch(err => {
          res.status(400).send(err);
        });
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

router.post('/top', (req, res) => {
  isohuntApi.search('x264', {
    category: 'movies',
    order: 'seeders'
  }).then(isohuntResults => {
    PirateBayAPI.topTorrents(200)
      .then(TPBResults => {
        let results = mySort(TPBResults, isohuntResults);
        movieService.imdb(results, data => res.send(data));
      })
      .catch(err => res.status(400).send(err));
  });
});

module.exports = router;