const express = require('express');
const router = express.Router();
const Client = require('node-torrent');
const client = new Client({logLevel: 'DEBUG'});

router.post('/', (req, res) => {
  console.log("test");
  const torrent = client.addTorrent("magnet:?xt=urn:btih:70842956a125fc686984e5f7e5c5b82b497fcbd0&dn=Silicon.Valley.S04E01.HDTV.x264-FUM%5Bettv%5D&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969");
  torrent.on('complete', () => {
      console.log('complete!');
      torrent.files.forEach(file => {
          var newPath = '/' + file.path;
          fs.rename(file.path, newPath);
          file.path = newPath;
      });
      res.redirect('/player');
  });
});

module.exports = router;
