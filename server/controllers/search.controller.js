var config = require('../config.json');
var express = require('express');
var router = express.Router();
var movieService = require('../services/movie.service');
var PirateBay = require('thepiratebay');

research = (req, res) => {
  PirateBay.search(req.body.searchquery.search, {
      category: 'video',
      page: 0,
      orderBy: 'seeds',
      sortBy: 'desc'
    })
    .then((results) => movieService.imdb(results, data => res.send(data)))
  .catch(err => res.status(400).send(err))
}

router.post('/', research)

module.exports = router;
