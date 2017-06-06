'use strict';

const express = require('express');
const router = express.Router();
const config = require('../config.json');

const torrentStream = require('torrent-stream');
const movieService = require('../services/movie.service');

const PirateBayAPI = require('thepiratebay');
const katAPI = require('../services/katScrapper.service');

const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({
  useragent: config.OpenSubtitlesUserAgent,
  ssl: true
});

const download = (magnet, callback) => {
  let engine = torrentStream(magnet, {
    path: 'server/public/movies/',
  });
  let i = 0;
  let j = 0;
  let end = 0;
  engine.on('ready', () => {
    engine.files.forEach(() => i++);
    engine.files.forEach(file => {
      let stream = file.createReadStream();
      let ext = file.name.split('.').pop();
      if ((ext === 'mp4' || ext === 'ogg' || ext === 'webm' || ext === 'mkv') && file.name.length >= 15 && end === 0) {
        end = 1;
        let time = stream._engine.torrent.length * 0.001 / 100;
        if (time < 5000)
          time += 5000;
        setTimeout(() => {
          if (i === 1)
            callback('/public/movies/' + file.name);
          else
            callback('/public/movies/' + stream._engine.torrent.name + '/' + file.name);
        }, time);
      }
      j++;
      if (j === i && end === 0)
        engine.destroy(() => callback('Error'));
    });
  });
};

router.post('/', (req, res) => {
  if (req.body.source === 'tpb' && req.body.torrentid && !isNaN(req.body.torrentid)) {
    PirateBayAPI.getTorrent(req.body.torrentid)
      .then(results => download(results.magnetLink, data => res.send(data)))
      .catch(err => res.status(400).send(err));
  } else if (req.body.source === 'kat' && req.body.torrentid) {
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
  if (req.body.source === 'tpb' && req.body.torrentid && !isNaN(req.body.torrentid)) {
    PirateBayAPI.getTorrent(req.body.torrentid)
      .then(results => {
        info.push(results);
        movieService.imdb(info, data => {
          OpenSubtitles.search({
              filename: data[0].name,
              imdbid: data[0].imdb.imdbid
            })
            .then(subtitles => {
              data[0].fr = subtitles.fr.url;
              data[0].en = subtitles.en.url;
              res.send(data);
            })
            .catch(() => res.send(data));
        });
      })
      .catch(err => res.status(400).send(err));
  } else if (req.body.source == 'kat' && req.body.torrentid) {
    katAPI.getTorrent(req.body.torrentid, results => {
      info.push(results);
      movieService.imdb(info, data => {
        OpenSubtitles.search({
            filename: data[0].name,
            imdbid: data[0].imdb.imdbid
          })
          .then(subtitles => {
            data[0].fr = subtitles.fr.url;
            data[0].en = subtitles.en.url;
            res.send(data);
          })
          .catch(() => res.send(data));
      });
    });
  }
});

module.exports = router;