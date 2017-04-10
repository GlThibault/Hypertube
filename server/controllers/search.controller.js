var config = require('../config.json');
var express = require('express');
var router = express.Router();
var PirateBay = require('thepiratebay');

router.post('/search', research)

module.exports = router;

function research(req, res) {
  const searchResults = PirateBay.search(req.body.query, {
    category: 'video',
    page: 3,
    orderBy: 'seeds',
    sortBy: 'desc'
  })
  console.log(searchResults);
  req.redirect('/library')
}
