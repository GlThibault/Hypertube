const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// Get our API routes
const api = require('./server/routes/api');
const login = require('./server/routes/login');
const register = require('./server/routes/register');

const app = express();

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');
var url = 'mongodb://localhost/hypertube';
MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB server");
  db.close();
});

app.use(session({
  secret: '84302ce98ef06a1968c9980687f858b57795d20a',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true
  }
}))

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, './server/public')));

// Set our api routes
app.use('/api', api);
app.use('/register', register);
app.use('/login', login);

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
