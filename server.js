require('rootpath')();
if (process.env.NODE_ENV === "dev")
  require("babel-core").transform("code", options);
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const config = require('./server/config.json');

// Get our routes and controllers
const api = require('./server/routes/api');
const userscontroller = require('./server/controllers/users.controller');
const searchcontroller = require('./server/controllers/search.controller');
const torrentdlcontroller = require('./server/controllers/torrentdl.controller');
const omniauthcontroller = require('./server/controllers/omniauth.controller');

// Create tmp folder for movies in /tmp/movies
const fs = require('fs');
const dir = '/goinfre/movies';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// MongoDB Connection
const MongoClient = require('mongodb').MongoClient,
  assert = require('assert');
MongoClient.connect('mongodb://localhost/mean', (err, db) => {
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB server");
  db.close();
});

// Parsers for POST data
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// routes
app.use('/users', userscontroller);
app.use('/search', searchcontroller);
app.use('/torrentdl', torrentdlcontroller);
app.use('/omniauth', omniauthcontroller);
app.use('/api', api);
// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Server running on localhost:${port}`));
