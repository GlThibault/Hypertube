'use strict';

const express = require('express');
const router = express.Router();
const movieService = require('../services/movie.service');
const PirateBayAPI = require('thepiratebay');
const katAPI = require('../services/katScrapper.service');
const Client = require('node-torrent');
const client = new Client({
  downloadPath: 'server/public/movies/',
  logLevel: 'ERROR',
  portRange: {
    start: 6881,
    end: 7881
  }
});

const download = (magnet, callback) => {
  let end = 0;
  let torrent = client.addTorrent(magnet);
  setTimeout(() => {
    if (torrent.files)
      torrent.files.forEach(file => {
        let ext = file.path.split('.').pop();
        if ((ext === 'mp4' || ext === 'ogg' || ext === 'webm' || ext === 'mkv') && end === 0) {
          end = 1;
          callback(file.path.replace('server', ''));
        }
      });
    if (end === 0)
      callback('Error');
  }, 20000);
};

router.post('/', (req, res) => {
  if (req.body.source === 'tpb') {
    PirateBayAPI.getTorrent(req.body.torrentid)
      .then(results => download(results.magnetLink, data => res.send(data)))
      .catch(err => res.status(400).send(err));
  } else if (req.body.source === 'kat') {
    katAPI.getTorrent(req.body.torrentid, results => {
      if (results && results.magnetLink)
        download(results.magnetLink, data => res.send(data));
      else
        res.status(400).send('err');
    });
  } else
    res.status(400).send('err');
});

router.post('/info', (req, res) => {
  let info = [];
  if (req.body.source === 'tpb') {
    PirateBayAPI.getTorrent(req.body.torrentid)
      .then(results => {
        info.push(results);
        movieService.imdb(info, data => res.send(data));
      })
      .catch(err => res.status(400).send(err));
  }
});

module.exports = router;