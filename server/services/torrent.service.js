const service = {};
const Client = require('node-torrent');
const path = require('path');
const cur = process.cwd();

service.torrentdl = (magnet) => {
  const client = new Client({downloadPath: path.join(cur,'src/assets/movies/'), logLevel: 'DEBUG'});
  const torrent = client.addTorrent(magnet);
  torrent.on('complete', () => {
      console.log('complete!');
      torrent.files.forEach(file => {
          var newPath = '/src/assets/movies/' + file.path;
          fs.rename(file.path, newPath);
          file.path = newPath;
      });
      res.redirect('/player');
  });
}

module.exports = service;
