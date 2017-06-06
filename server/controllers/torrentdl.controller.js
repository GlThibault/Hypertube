'use strict';

const torrentStream = require('torrent-stream');
const express = require('express');
const router = express.Router();
const movieService = require('../services/movie.service');
const userService = require('../services/user.service');
const PirateBayAPI = require('thepiratebay');
const katAPI = require('../services/katScrapper.service');

const download = (magnet, user, callback) => {
  userService.viewsMovies(magnet, user);
  let engine = torrentStream(magnet, {
    path: 'server/public/movies/',
  });
  let i = 0;
  engine.on('ready', () => {
    engine.files.forEach(() => i++);
    engine.files.forEach(file => {
      let stream = file.createReadStream();
      let ext = file.name.split('.').pop();
      if ((ext === 'mp4' || ext === 'ogg' || ext === 'webm' || ext === 'mkv') && file.name.length >= 15) {
        setTimeout(() => {
          if (i === 1)
            callback('/public/movies/' + file.name);
          else
            callback('/public/movies/' + stream._engine.torrent.name + '/' + file.name);
        }, stream._engine.torrent.length * 0.001 / 100);
      }
    });
  });
};

router.post('/', (req, res) => {
  if (req.body.source === 'tpb') {
    PirateBayAPI.getTorrent(req.body.torrentid)
      .then(results => download(results.magnetLink, data => res.send(data)))
      .catch(err => res.status(400).send(err));
  } else if (req.body.source === 'kat') {
    katAPI.getTorrent(req.body.torrentid, results => {
      if (results && results.magnetLink)
        download(results.magnetLink, req.body.user, data => res.send(data));
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