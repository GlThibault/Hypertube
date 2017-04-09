var config = require('../config.json');
var express = require('express');
var router = express.Router();
var userService = require('../services/user.service');
var sendmail = require('sendmail')();

router.post('/authenticate', authenticate);
router.post('/register', register);
router.post('/forgot', forgot);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/reset/:_id', reset);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function reset(req, res) {
  userService.getByResetid(req.params._id)
    .then(function (user) {
      if (user) {
        var hash = (Math.random() + 1).toString(36).substr(2, 15)
        userParam = {
          password: req.params._id,
          reset: hash
        };
        userService.update(user._id, userParam)
          .then(function () {
            res.redirect('/login');
          })
          .catch(function (err) {
            res.redirect(400, '/login');
          });
      } else {
        res.redirect(401, '/login');
      }
    })
    .catch(function (err) {
      res.redirect(400, '/login');
    });
}

function forgot(req, res) {
  userService.getByName(req.body.username)
    .then(function (user) {
      if (user) {
        var hash = (Math.random() + 1).toString(36).substr(2, 15)
        if (user.language && user.language == french) {
          var fullUrl = '<a href="' + req.protocol + '://' + req.get('host') + '/users/reset/' + hash + '">Réinitialiser le mot de passe</a>'
          sendmail({
            from: 'tglandai@student.42.fr',
            to: user.email,
            subject: 'Hypertube | Mot de passe oublié',
            html: 'Vous avez effectuez une demande de réinitialisation du mot de passe sur le site Hypertube <br/> Cliquez sur le lien ci-dessous pour continuer:<br/>' + fullUrl + '<br/><br/>Vous pourrez ensuite vous connecter avec le mot de passe : ' + hash,
          }, function (err, reply) {
            console.log(err && err.stack)
            console.dir(reply)
          })
        } else {
          var fullUrl = '<a href="' + req.protocol + '://' + req.get('host') + '/users/reset/' + hash + '">Reset the password</a>'
          sendmail({
            from: 'tglandai@student.42.fr',
            to: user.email,
            subject: 'Hypertube | Forgotten password',
            html: 'You ask to reset your password on the website Hypertube <br/> Click on the link to continue:<br/>' + fullUrl + '<br/><br/>You will then be able to connect with the password : ' + hash,
          }, function (err, reply) {
            console.log(err && err.stack)
            console.dir(reply)
          })
        }
        userParam = {
          reset: hash
        };
        userService.update(user._id, userParam)
          .then(function () {
            res.sendStatus(200);
          })
          .catch(function (err) {
            res.status(400).send(err);
          });
      } else {
        res.status(401).send('Incorrect username');
      }
    })
    .catch(function (err) {
      res.status(400).send(err);
    })
}

function authenticate(req, res) {
  userService.authenticate(req.body.username, req.body.password)
    .then(function (user) {
      if (user) {
        res.send(user);
      } else {
        res.status(401).send('Username or password is incorrect');
      }
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

function register(req, res) {
  userService.create(req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

function getAll(req, res) {
  userService.getAll()
    .then(function (users) {
      res.send(users);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

function getCurrent(req, res) {
  userService.getById(req.user.sub)
    .then(function (user) {
      if (user) {
        res.send(user);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

function update(req, res) {
  userService.update(req.params._id, req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

function _delete(req, res) {
  userService.delete(req.params._id)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}
