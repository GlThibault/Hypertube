var config = require('../config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {
  native_parser: true
});
db.bind('users');

var service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.getByName = getByName;
service.getByResetid = getByResetid;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
  var deferred = Q.defer();

  db.users.findOne({
    username: username
  }, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (user && bcrypt.compareSync(password, user.hash)) {
      deferred.resolve({
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        language: user.language,
        token: jwt.sign({
          sub: user._id
        }, config.secret)
      });
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
}

function getAll() {
  var deferred = Q.defer();

  db.users.find().toArray(function (err, users) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    users = _.map(users, function (user) {
      return _.omit(user, 'hash');
    });

    deferred.resolve(users);
  });

  return deferred.promise;
}

function getById(_id) {
  var deferred = Q.defer();

  db.users.findById(_id, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (user)
      deferred.resolve(_.omit(user, 'hash'));
    else
      deferred.resolve();
  });

  return deferred.promise;
}

function getByName(username) {
  var deferred = Q.defer();

  db.users.findOne({
    username: username
  }, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (user)
      deferred.resolve(_.omit(user, 'hash'));
    else
      deferred.resolve();
  });

  return deferred.promise;
}

function getByResetid(resetid) {
  var deferred = Q.defer();

  db.users.findOne({
    reset: resetid
  }, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (user)
      deferred.resolve(_.omit(user, 'hash'));
    else
      deferred.resolve();
  });

  return deferred.promise;
}

function create(userParam) {
  var deferred = Q.defer();

  db.users.findOne({
      username: userParam.username
    },
    function (err, user) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      if (userParam.password != userParam.password2)
        deferred.reject('Password does not match')
      else if (user) {
        deferred.reject('Username "' + userParam.username + '" is already taken');
      } else {
        createUser();
      }
    });

  function createUser() {
    var user = _.omit(userParam, 'password', 'password2');

    user.hash = bcrypt.hashSync(userParam.password, 10);
    user.language = "English";
    db.users.insert(
      user,
      function (err, doc) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
      });
  }

  return deferred.promise;
}

function update(_id, userParam) {
  var deferred = Q.defer();
  db.users.findById(_id, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (user.username !== userParam.username) {
      db.users.findOne({
          username: userParam.username
        },
        function (err, user) {
          if (err) deferred.reject(err.name + ': ' + err.message);

          if (user) {
            deferred.reject('Username "' + req.body.username + '" is already taken')
          } else if (userParam.password && userParam.password2) {
            if (userParam.password !== userParam.password2) {
              deferred.reject('Password does not match')
            } else {
              updateUser();
            }
          } else {
            updateUser();
          }
        });
    } else if (userParam.password) {
      if (userParam.password !== userParam.password2) {
        deferred.reject('Password does not match')
      } else {
        updateUser();
      }
    } else {
      updateUser();
    }
  });

  function updateUser() {
    if (userParam.language == 2)
      userParam.language = "Français";
    else
      userParam.language = "English";
    if (userParam.firstName && userParam.lastName && userParam.username && userParam.email && userParam.language)
      var set = {
        firstName: userParam.firstName,
        lastName: userParam.lastName,
        username: userParam.username,
        language: userParam.language,
        email: userParam.email
      };
    else if (userParam.reset)
      var set = {
        reset: userParam.reset
      };
    else
      var set = {};

    if (userParam.password && userParam.password2) {
      set.hash = bcrypt.hashSync(userParam.password, 10);
    }

    db.users.update({
        _id: mongo.helper.toObjectID(_id)
      }, {
        $set: set
      },
      function (err, doc) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve({
          _id: _id,
          username: userParam.username,
          firstName: userParam.firstName,
          lastName: userParam.lastName,
          email: userParam.email,
          language: userParam.language,
          token: jwt.sign({
            sub: _id
          }, config.secret)
        });
      });
  }

  return deferred.promise;
}

function _delete(_id) {
  var deferred = Q.defer();

  db.users.remove({
      _id: mongo.helper.toObjectID(_id)
    },
    function (err) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve();
    });

  return deferred.promise;
}
