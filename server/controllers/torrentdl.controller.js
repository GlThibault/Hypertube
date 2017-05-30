'use strict';

const express = require('express');
const router = express.Router();
const PirateBay = require('thepiratebay');
const Client = require('node-torrent');
const path = require('path');
const cur = process.cwd();
const fs = require('fs');

const torrentdl = (magnet, key, callback) => {
  const dlpath = 'server/public/movies/' + key + '/';
  let end = 0;
  const DIR = path.join(cur, dlpath);

  if (!fs.existsSync(dlpath))
    fs.mkdirSync(dlpath);

  let client = new Client({
    downloadPath: DIR,
    logLevel: 'ERROR'
  });
  let torrent = client.addTorrent(magnet);

  setTimeout(() => {
    torrent.files.forEach(file => {
      let ext = file.path.split('.').pop();
      if ((ext === 'mp4' || ext === 'ogg' || ext === 'webm' || ext === 'mkv') && end === 0) {
        end = 1;
        callback(file.path.replace(cur + '/server', ''));
      }
    });
    if (end === 0)
      callback('Error');
  }, 10000);
};

router.post('/', (req, res) => {
  PirateBay.getTorrent(req.body.torrentdl)
    .then(results => torrentdl(results.magnetLink, req.body.torrentdl, data => res.send(data)))
    .catch(err => res.status(400).send(err));
});

module.exports = router;