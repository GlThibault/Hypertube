const express = require('express');
const router = express.Router();
const PirateBay = require('thepiratebay');
const movieService = require('../services/movie.service');

router.post('/', (req, res) => {
  PirateBay.search(req.body.searchquery.search, {
      category: 'video',
      page: 0,
      orderBy: 'seeds',
      sortBy: 'desc'
    })
    .then(results => movieService.imdb(results, data => res.send(data)))
  .catch(err => res.status(400).send(err))
})

router.post('/top', (req, res) => {
  PirateBay.topTorrents(200)
    .then(results => movieService.imdb(results, data => res.send(data)))
  .catch(err => res.status(400).send(err))
})

module.exports = router;
