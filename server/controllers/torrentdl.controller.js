'use strict';

const express = require('express');
const router = express.Router();
const PirateBay = require('thepiratebay');
const Client = require('node-torrent');
const client = new Client({
  downloadPath: 'server/public/movies/',
  logLevel: 'ERROR',
  portRange: {
    start: 6881,
    end: 7881
  }
});

const torrentdl = (magnet, callback) => {
  let end = 0;
  let torrent = client.addTorrent(magnet);
  setTimeout(() => {
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
  PirateBay.getTorrent(req.body.torrentdl)
    .then(results => torrentdl(results.magnetLink, data => res.send(data)))
    .catch(err => res.status(400).send(err));
});

module.exports = router;