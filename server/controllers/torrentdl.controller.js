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
  let torrent = client.addTorrent('magnet:?xt=urn:btih:d6cea69315cdaf73e596fe6db2505690ad04656b&dn=Prison.Break.S05E09.HDTV.x264-KILLERS%5Bettv%5D&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969');
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