var express = require('express');
var router = express.Router();
var session = require('express-session');
var bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  url = 'mongodb://localhost/hypertube';

var user = "";

router.post('/', function (req, res) {
  if (req.body.username && req.body.username) {
    var findUser = function (db, callback) {
      db.collection('users').findOne({
        "username": req.body.username
      }, function (err, result) {
        assert.equal(err, null);
        user = result;
        callback(result);
      });
    };
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      findUser(db, function () {
        db.close();
      });
    });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.username = req.body.username;
        res.status(200);
        res.send();
      } else {
        res.status(401);
        res.send("Wrong password.");
      }
    } else {
      res.status(401);
      res.send("Wrong username.");
    }
  }
});

module.exports = router;
