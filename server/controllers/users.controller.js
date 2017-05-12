const config = require('../config.json');
const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const sendmail = require('sendmail')();

reset = (req, res) => {
  userService.getByResetid(req.params._id)
    .then(user => {
      if (user) {
        const hash = (Math.random() + 1).toString(36).substr(2, 15)
        userParam = {
          password: req.params._id,
          reset: hash
        };
        userService.update(user._id, userParam)
          .then(() => res.redirect('/login'))
          .catch(err => res.redirect(400, '/login'));
      } else {
        res.redirect(401, '/login');
      }
    })
    .catch(err => res.redirect(400, '/login'));
}

forgot = (req, res) => {
  userService.getByName(req.body.username)
    .then(user => {
      if (user) {
        const hash = (Math.random() + 1).toString(36).substr(2, 15)
        if (user.language && user.language == "Français") {
          const fullUrl = '<a href="' + req.protocol + '://' + req.get('host') + '/users/reset/' + hash + '">Réinitialiser le mot de passe</a>'
          sendmail({
            from: 'tglandai@student.42.fr',
            to: user.email,
            subject: 'Hypertube | Mot de passe oublié',
            html: 'Vous avez effectuez une demande de réinitialisation du mot de passe sur le site Hypertube <br/> Cliquez sur le lien ci-dessous pour continuer:<br/>' + fullUrl + '<br/><br/>Vous pourrez ensuite vous connecter avec le mot de passe : ' + hash,
          }, (err, reply) => {
            console.log(err && err.stack)
            console.dir(reply)
          })
        } else {
          const fullUrl = '<a href="' + req.protocol + '://' + req.get('host') + '/users/reset/' + hash + '">Reset the password</a>'
          sendmail({
            from: 'tglandai@student.42.fr',
            to: user.email,
            subject: 'Hypertube | Forgotten password',
            html: 'You ask to reset your password on the website Hypertube <br/> Click on the link to continue:<br/>' + fullUrl + '<br/><br/>You will then be able to connect with the password : ' + hash,
          }, (err, reply) => {
            console.log(err && err.stack)
            console.dir(reply)
          })
        }
        userParam = {
          reset: hash
        };
        userService.update(user._id, userParam)
          .then(() => res.sendStatus(200))
          .catch(err => res.status(400).send(err));
      } else {
        res.status(401).send('Incorrect username');
      }
    })
    .catch(err => res.status(400).send(err))
}

authenticate = (req, res) => {
  userService.authenticate(req.body.username, req.body.password)
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res.status(401).send('Username or password is incorrect');
      }
    })
    .catch(err => res.status(400).send(err));
}

register = (req, res) => {
  userService.create(req.body)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(400).send(err));
}

getUser = (req, res) => {
  userService.getByName(req.params._name)
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => res.status(400).send(err));
}

getCurrent = (req, res) => {
  userService.getById(req.user.sub)
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => res.status(400).send(err));
}

update = (req, res) => {
  userService.update(req.params._id, req.body)
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res.status(401).send('Error');
      }
    })
    .catch(err => res.status(400).send(err));
}

router.post('/authenticate', authenticate);
router.post('/register', register);
router.post('/forgot', forgot);
router.get('/:_name', getUser);
router.get('/current', getCurrent);
router.get('/reset/:_id', reset);
router.post('/:_id', update);

module.exports = router;
