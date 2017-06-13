'use strict';

const express = require('express');
const router = express.Router();
const config = require('../config.json');
const fs = require('fs');

const torrentStream = require('torrent-stream');
const movieService = require('../services/movie.service');
const userService = require('../services/user.service');
const PirateBayAPI = require('thepiratebay');
const katAPI = require('../services/katScrapper.service');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({
  useragent: config.OpenSubtitlesUserAgent,
  ssl: true
});
const srt2vtt = require('srt2vtt');
const download = require('url-download');

const downloadmovie = (magnet, user) => {
  return new Promise(resolve => {
    userService.viewsMovies(magnet, user);
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
          let time = stream._engine.torrent.length * 0.001 / 100 + 5000;
          setTimeout(() => {
            if (i === 1)
              resolve('/public/movies/' + file.name);
            else
              resolve('/public/movies/' + stream._engine.torrent.name + '/' + file.name);
          }, time);
        }
        j++;
        if (j === i && end === 0)
          engine.destroy(() => resolve('Error'));
      });
    });
  });
};

router.post('/', (req, res) => {
  if (req.body.source === 'tpb' && req.body.torrentid && !isNaN(req.body.torrentid)) {
    PirateBayAPI.getTorrent(req.body.torrentid)
      .then(results => downloadmovie(results.magnetLink, req.body.user)
        .then(data => res.send(data)))
      .catch(err => res.status(400).send(err));
  } else if (req.body.source === 'kat' && req.body.torrentid) {
    katAPI.getTorrent(req.body.torrentid)
      .then(results => {
        if (results && results.magnetLink)
          downloadmovie(results.magnetLink, req.body.user)
          .then(data => res.send(data));
        else
          res.status(400).send('err');
      });
  } else
    res.status(400).send('err');
});

const downloadSubtitles = (subtitles, data) => {
  return new Promise(resolve => {
    let path = './server/public/subtitles/';
    let subfr = '';
    download([
        subtitles.fr.url
      ], path)
      .on('close', (err, url, file) => {
        subfr = file;
      }).on('done', () => {
        let srtData = fs.readFileSync('./' + subfr);
        srt2vtt(srtData, (err, vttData) => {
          fs.writeFileSync(path + data[0].name + 'fr.vtt', vttData);
        });
      });
    let suben = '';
    download([
        subtitles.en.url
      ], path)
      .on('close', (err, url, file) => {
        suben = file;
      }).on('done', () => {
        let srtData = fs.readFileSync('./' + suben);
        srt2vtt(srtData, (err, vttData) => {
          fs.writeFileSync(path + data[0].name + 'en.vtt', vttData);
        });
      });
    data[0].fr = '/public/subtitles/' + data[0].name + 'fr.vtt';
    data[0].en = '/public/subtitles/' + data[0].name + 'en.vtt';
    resolve(data);
  });
};

router.post('/info', (req, res) => {
  let info = [];
  if (req.body.source === 'tpb' && req.body.torrentid && !isNaN(req.body.torrentid)) {
    PirateBayAPI.getTorrent(req.body.torrentid)
      .then(results => {
        info.push(results);
        movieService.imdb(info)
          .then(data => {
            OpenSubtitles.search({
                season: data[0].title.season,
                episode: data[0].title.episode,
                imdbid: data[0].imdb.imdbid,
                filename: data[0].name
              })
              .then(subtitles => downloadSubtitles(subtitles, data)
                .then(data => res.send(data)))
              .catch(() => res.send(data));
          });
      })
      .catch(err => res.status(400).send(err));
  } else if (req.body.source == 'kat' && req.body.torrentid) {
    katAPI.getTorrent(req.body.torrentid)
      .then(results => {
        info.push(results);
        movieService.imdb(info)
          .then(data => {
            OpenSubtitles.search({
                season: data[0].title.season,
                episode: data[0].title.episode,
                imdbid: data[0].imdb.imdbid,
                filename: data[0].name
              })
              .then(subtitles => downloadSubtitles(subtitles, data)
                .then(data => res.send(data)))
              .catch(() => res.send(data));
          });
      });
  }
});

module.exports = router;