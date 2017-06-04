'use strict';

const torrentStream = require('torrent-stream');


const express = require('express');
const router = express.Router();
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

  var engine = torrentStream(magnet, {
    path: 'server/public/movies/',
  });
  var i = 0;
  engine.on('ready', function(e) {
    engine.files.forEach(function(file) {
    i++;
  })
    engine.files.forEach(function(file) {
        var stream = file.createReadStream();
        let ext = file.name.split('.').pop();
        if ((ext === 'mp4' || ext === 'ogg' || ext === 'webm' || ext === 'mkv') && file.name.length >= 15) {
          console.log(stream._engine.torrent.length);
          var time = stream._engine.torrent.length * 0.001 / 100;
          setTimeout(function(){
          if (i === 1)
            callback("/public/movies/" + file.name);
          else
            callback("/public/movies/" + stream._engine.torrent.name + "/" + file.name);
          }, time);
        }
    });
  });

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

module.exports = router;