const express = require('express');
const router = express.Router();
const PirateBay = require('thepiratebay');
const torrentService = require('../services/torrent.service');

router.post('/', (req, res) => {
  PirateBay.getTorrent(req.body.torrentdl)
    .then(results => res.send(torrentService.torrentdl(results.magnetLink)))
  .catch(err => res.status(400).send(err))
});

module.exports = router;
