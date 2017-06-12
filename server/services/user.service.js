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
  return new Promise((resolve, reject) => {
    db.users.findOne({
      id: id
    }, (err, user) => {
      if (err)
        reject(err.name + ': ' + err.message);
      if (user) {
        resolve({
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
        resolve();
      }
    });
  });
};

const authenticate = (username, password) => {
  return new Promise((resolve, reject) => {
    db.users.findOne({
      username: username
    }, (err, user) => {
      if (err)
        reject(err.name + ': ' + err.message);
      if (user && bcrypt.compareSync(password, user.hash)) {
        resolve({
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
        resolve();
      }
    });
  });
};

const getById = (_id) => {
  return new Promise((resolve, reject) => {
    db.users.findById(_id, (err, user) => {
      if (err)
        reject(err.name + ': ' + err.message);
      if (user)
        resolve(_.omit(user, 'hash'));
      else
        resolve();
    });
  });
};

const getByName = (username) => {
  return new Promise((resolve, reject) => {
    db.users.findOne({
      username: username
    }, (err, user) => {
      if (err)
        reject(err.name + ': ' + err.message);
      if (user)
        resolve(_.omit(user, 'hash'));
      else
        resolve();
    });
  });
};

const getByResetid = (resetid) => {
  return new Promise((resolve, reject) => {
    db.users.findOne({
      reset: resetid
    }, (err, user) => {
      if (err) reject(err.name + ': ' + err.message);

      if (user)
        resolve(_.omit(user, 'hash'));
      else
        resolve();
    });
  });
};

const create = (userParam) => {
  return new Promise((resolve, reject) => {
    db.users.findOne({
        username: userParam.username
      },
      (err, user) => {
        if (err) reject(err.name + ': ' + err.message);

        if (userParam.password != userParam.password2)
          reject('Password does not match');
        else if (user) {
          reject('Username "' + userParam.username + '" is already taken');
        } else {
          let user = _.omit(userParam, 'password', 'password2');

          if (user.key != 'z30MohzdcqIHx5o9zYl7Z85A')
            user.hash = bcrypt.hashSync(userParam.password, 10);
          user.language = 'English';
          user.tab = [];
          db.users.insert(
            user,
            (err) => {
              if (err)
                reject(err.name + ': ' + err.message);
              resolve();
            });
        }
      });
  });
};

const update = (_id, userParam) => {

  const updateUser = (resolve, reject) => {
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
        if (err) reject(err.name + ': ' + err.message);

        resolve({
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

  return new Promise((resolve, reject) => {
    db.users.findById(_id, (err, user) => {
      if (err || !user) reject(err.name + ': ' + err.message);
      if (user.username !== userParam.username) {
        db.users.findOne({
            username: userParam.username
          },
          (err, user) => {
            if (err) reject(err.name + ': ' + err.message);
            if (user) {
              reject('Username "' + userParam.username + '" is already taken');
            } else if (userParam.password && userParam.password2) {
              if (userParam.password !== userParam.password2) {
                reject('Password does not match');
              } else {
                updateUser(resolve, reject);
              }
            } else {
              updateUser(resolve, reject);
            }
          });
      } else if (userParam.password2) {
        if (userParam.password !== userParam.password2) {
          reject('Password does not match');
        } else {
          updateUser(resolve, reject);
        }
      } else {
        updateUser(resolve, reject);
      }
    });
  });
};

// Ajoute le film dans les films vues

const viewsMovies = (magnet, user) => {
  db.users.findById(user._id, (err, user) => {
    if (user.tab.indexOf(magnet) === -1)
      db.users.update({
        _id: mongo.helper.toObjectID(user._id)
      }, {
        $push: {
          tab: magnet
        }
      });
  });
};

// Verifie pour chaque film s'il a etait vu et ajoute une variable a l'object

const moviesViewed = (user, tabMovie, callback) => {
  db.users.findById(user._id, (err, user1) => {
    for (let i = 0; i <= tabMovie.length; i++)
      for (let j = 0; j <= user1.tab.length; j++) {
        if (tabMovie[i]) {
          if (tabMovie[i].magnetLink.indexOf(user1.tab[j]) >= 0) {
            tabMovie[i].vu = 'yes';
            break;
          } else
            tabMovie[i].vu = 'no';
        }
      }
    callback(tabMovie);
  });
};

service.moviesViewed = moviesViewed;
service.viewsMovies = viewsMovies;
service.authenticate = authenticate;
service.authenticateomniauth = authenticateomniauth;
service.getById = getById;
service.getByName = getByName;
service.getByResetid = getByResetid;
service.create = create;
service.update = update;

module.exports = service;