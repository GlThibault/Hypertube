var config = require('../config.json');
var express = require('express');
var router = express.Router();
var movieService = require('../services/movie.service');
var PirateBay = require('thepiratebay');

router.post('/', research)

module.exports = router;

function research(req, res) {
  PirateBay.search(req.body.searchquery.search, {
      category: 'video',
      page: 3,
      orderBy: 'seeds',
      sortBy: 'desc'
    })
    .then(function (results) {
      movieService.imdb(results)
    }).then(function (movies) {
      console.log(movies);
      console.log("test");
      res.send(movies);
    })
  // .catch(err => res.status(400).send(err))
}
