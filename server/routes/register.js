var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  url = 'mongodb://localhost/hypertube';
var user = "";

router.post('/', function (req, res) {
  if (req.body.password == req.body.password2) {
    var findUser = function (db, callback) {
      db.collection('users').findOne({
        "username": req.body.username
      }, function (err, result) {
        assert.equal(err, null);
        user = result;
        callback(result);
      });
    };
    var insertUser = function (db, callback) {
      db.collection('users').insertOne({
        "username": req.body.username,
        "password": bcrypt.hashSync(req.body.password, 12)
      }, function (err, result) {
        assert.equal(err, null);
        callback();
      });
    };
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      findUser(db, function () {
        if (!user)
          insertUser(db, function () {
            db.close();
          });
        else
          db.close();
      });
    });
    if (user) {
      res.status(422);
      res.send("Username already taken.");
    } else {
      res.status(200);
      res.send();
    }
  } else {
    res.status(422);
    res.send("Passwords dont match.");
  }
});

module.exports = router;
