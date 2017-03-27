var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var url = 'mongodb://localhost/hypertube';

router.post('/', function(req, res) {
  if (req.body.password == req.body.password2) {

    var insertUser = function(db, callback) {
      db.collection('users').insertOne( {
        "username" : req.body.username,
        "password" : req.body.password
      }, function(err, result) {
      assert.equal(err, null);
      callback();
      });
    };
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      insertUser(db, function() {
          db.close();
      });
    });
    res.status('200');
    res.redirect('/');
  } else
    res.send('Les mot de passes ne correspondent pas.')
});

module.exports = router;
