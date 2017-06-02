'use strict';

const express = require('express');
const router = express.Router();
const isohuntApi = require('kat-api-ce');
const CPBAPI = require('cpasbien-api');
const api = new CPBAPI();
const PirateBayAPI = require('thepiratebay');
const movieService = require('../services/movie.service');

const compare = (a, b) => {
  if (parseInt(a.seeders) < parseInt(b.seeders))
    return 1;
  if (parseInt(a.seeders) > parseInt(b.seeders))
    return -1;
  return 0;
};

const mySort = (tpb, cpb) => {
  cpb.forEach((element) => {
    tpb.push(element);
  }, this);
  tpb.sort(compare);
  return tpb;
};

router.post('/', (req, res) => {
  // api.Search(req.body.searchquery.search, {
  //     category: 'movies',
  //     order: 'seeders'
  //   }).then(isohuntResults => {
  api.Search(req.body.searchquery.search, {
      scope: 'movies'
    }).then(cpasbienResults => {
      // console.log(cpabienResults);
      PirateBayAPI.search(req.body.searchquery.search, {
          category: 'movies',
          page: 0,
          orderBy: 'seeds',
          sortBy: 'desc'
        })
        .then(TPBResults => {
          // movieService.imdb(mySort(TPBResults, cpabienResults.items), data => {
          movieService.imdb(cpasbienResults.items, data => {
            // console.log(data);
            res.send(data);
            // console.log(cpasbienResults.items);
            // res.send(cpasbienResults.items);
          });
        })
        .catch(err => {
          console.log(err);
          res.status(400).send(err);
        });
    })
    .catch(err => {
      console.log(err);
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