'use strict';

const express = require('express');
const router = express.Router();
const movieService = require('../services/movie.service');
const PirateBayAPI = require('thepiratebay');
const katAPI = require('../services/katScrapper.service');
const uniq = require('uniq');

const compare = (a, b) => {
  if (parseInt(a.seeders) < parseInt(b.seeders))
    return 1;
  if (parseInt(a.seeders) > parseInt(b.seeders))
    return -1;
  return 0;
};

const unique = (a, b) => {
  if (a.subcategory && a.subcategory.id === '299')
    return 0;
  if (a.seeders == b.seeders && a.name === b.name)
    return 0;
  else
    return 1;
};

const mySort = (src1, src2) => {
  src2.forEach((element) => src1.push(element), this);
  src1.sort(compare);
  uniq(src1, unique, true);
  return src1;
};

router.post('/', (req, res) => {
  katAPI.search(req.body.searchquery.search, katResults => {
    PirateBayAPI.search(req.body.searchquery.search, {
        category: 'video',
        page: 0,
        orderBy: 'seeds',
        sortBy: 'desc'
      })
      .then(TPBResults => {
        movieService.imdb(mySort(TPBResults, katResults), data => res.send(data));
      })
      .catch(err => res.status(400).send(err));
  });
});

router.post('/top', (req, res) => {
  katAPI.searchtop(katResults => {
    PirateBayAPI.topTorrents(200)
      .then(TPBResults => {
        movieService.imdb(mySort(TPBResults, katResults), data => res.send(data));
      })
      .catch(err => res.status(400).send(err));
  });
});

module.exports = router;