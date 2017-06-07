'use strict';

const config = require('../config.json');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Q = require('q');
const mongo = require('mongoskin');
const db = mongo.db(config.connectionString, {
  native_parser: true
});
db.bind('users');

const service = {};

const authenticateomniauth = (id) => {
  let deferred = Q.defer();
  db.users.findOne({
    id: id
  }, (err, user) => {
    if (err) deferred.reject(err.name + ': ' + err.message);
    if (user) {
      deferred.resolve({
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        tab: [],
        language: user.language,
        image_url: user.image_url,
        token: jwt.sign({
          sub: user._id
        }, config.secret)
      });
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
};

const authenticate = (username, password) => {
  let deferred = Q.defer();

  db.users.findOne({
    username: username
  }, (err, user) => {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (user && bcrypt.compareSync(password, user.hash)) {
      deferred.resolve({
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        tab: [],
        language: user.language,
        image_url: user.image_url,
        token: jwt.sign({
          sub: user._id
        }, config.secret)
      });
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
};

const getById = (_id) => {
  let deferred = Q.defer();

  db.users.findById(_id, (err, user) => {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (user)
      deferred.resolve(_.omit(user, 'hash'));
    else
      deferred.resolve();
  });

  return deferred.promise;
};

const getByName = (username) => {
  let deferred = Q.defer();

  db.users.findOne({
    username: username
  }, (err, user) => {
    if (err) deferred.reject(err.name + ': ' + err.message);
    if (user)
      deferred.resolve(_.omit(user, 'hash'));
    else
      deferred.resolve();
  });

  return deferred.promise;
};

const getByResetid = (resetid) => {
  let deferred = Q.defer();

  db.users.findOne({
    reset: resetid
  }, (err, user) => {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if (user)
      deferred.resolve(_.omit(user, 'hash'));
    else
      deferred.resolve();
  });

  return deferred.promise;
};

const create = (userParam) => {
  const createUser = () => {
    let user = _.omit(userParam, 'password', 'password2');

    if (user.key != 'z30MohzdcqIHx5o9zYl7Z85A')
      user.hash = bcrypt.hashSync(userParam.password, 10);
    user.language = 'English';
    user.tab = [];
    db.users.insert(
      user,
      (err) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve();
      });
  };

  let deferred = Q.defer();

  db.users.findOne({
      username: userParam.username
    },
    (err, user) => {
      if (err) deferred.reject(err.name + ': ' + err.message);

      if (userParam.password != userParam.password2)
        deferred.reject('Password does not match');
      else if (user) {
        deferred.reject('Username "' + userParam.username + '" is already taken');
      } else {
        createUser();
      }
    });

  return deferred.promise;
};

const update = (_id, userParam) => {

  const updateUser = () => {
    if (userParam.language == 'Français')
      userParam.language = 'Français';
    else
      userParam.language = 'English';
    if (userParam.firstName && userParam.lastName && userParam.username && userParam.email && userParam.language)
      var set = {
        firstName: userParam.firstName,
        lastName: userParam.lastName,
        username: userParam.username,
        language: userParam.language,
        email: userParam.email,
        image_url: userParam.image_url
      };
    else if (userParam.reset)
      var set = {
        reset: userParam.reset
      };
    else
      var set = {};

    if (userParam.password) {
      set.hash = bcrypt.hashSync(userParam.password, 10);
    }

    db.users.update({
        _id: mongo.helper.toObjectID(_id)
      }, {
        $set: set
      },
      (err) => {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve({
          _id: _id,
          username: userParam.username,
          firstName: userParam.firstName,
          lastName: userParam.lastName,
          email: userParam.email,
          language: userParam.language,
          image_url: userParam.image_url,
          token: jwt.sign({
            sub: _id
          }, config.secret)
        });
      });
  };

  let deferred = Q.defer();
  db.users.findById(_id, (err, user) => {
    if (err || !user) deferred.reject(err.name + ': ' + err.message);
    if (user.username !== userParam.username) {
      db.users.findOne({
          username: userParam.username
        },
        (err, user) => {
          if (err) deferred.reject(err.name + ': ' + err.message);
          if (user) {
            deferred.reject('Username "' + userParam.username + '" is already taken');
          } else if (userParam.password && userParam.password2) {
            if (userParam.password !== userParam.password2) {
              deferred.reject('Password does not match');
            } else {
              updateUser();
            }
          } else {
            updateUser();
          }
        });
    } else if (userParam.password2) {
      if (userParam.password !== userParam.password2) {
        deferred.reject('Password does not match');
      } else {
        updateUser();
      }
    } else {
      updateUser();
    }
  });

  return deferred.promise;
};

const viewsMovies = (magnet, user) => {
  console.log(user._id);
  /*db.users.findById(user._id, (err, user) => {
    if (user.tab.indexOf(magnet) === -1)
      db.users.update({_id: mongo.helper.toObjectID(user._id) }, { $push : {tab: magnet} }, (err) => console.log(err));
  }); */
}

service.viewsMovies = viewsMovies;
service.authenticate = authenticate;
service.authenticateomniauth = authenticateomniauth;
service.getById = getById;
service.getByName = getByName;
service.getByResetid = getByResetid;
service.create = create;
service.update = update;

module.exports = service;