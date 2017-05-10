const express = require('express');
const router = express.Router();
const request = require('request');
const userService = require('../services/user.service');
const GoogleAuth = require('google-auth-library');
const auth = new GoogleAuth;
const client = new auth.OAuth2('875390065252-87a075iiojt5ep1sgo6q8do8jecbr133.apps.googleusercontent.com', '', '');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


passport.use(new GoogleStrategy({
    clientID: "875390065252-87a075iiojt5ep1sgo6q8do8jecbr133.apps.googleusercontent.com",
    clientSecret: "6WwICkKXDtYjc-WCQTrBm_d2",
    callbackURL: "http://localhost:3000/omniauth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
      //  User.findOrCreate({ googleId: profile.id }, (err, user) => {
      //    return done(err, user);
      //  });
  }
));

passport.use(new FacebookStrategy({
    clientID: "1469563736440617",
    clientSecret: "fd181967c274cfaca9c3b280069b4322",
    callbackURL: "http://localhost:3000/omniauth/facebook/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    done('');
    // User.findOrCreate(..., (err, user) => {
    //   if (err) { return done(err); }
      // done(null, user);
    // });
  }
));

router.get('/google',  passport.authenticate('google', { scope: ['profile'] }));
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
router.get('/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));

authenticate = (username, id) => {
  userService.authenticate42(username, id)
    .then(user => {
      if (user) {
        return user;
      } else {
        res.status(401).send('Username or password is incorrect');
      }
    })
    .catch(err => res.status(400).send(err));
}

router.get('/42', (req, res) => {
  request.post(
    'https://api.intra.42.fr/oauth/token',
    { form: {
    grant_type: 'authorization_code',
    client_id: '9d3165e2129af22a2dc22c66fcd5a4ae80164d24691f149451e0e622463a0674',
    client_secret: '7d27b5aa1d3e0e4c25f4f0ca0bf1320675f3b48c52166bd73095fb138f63dbc7',
    code: req.query.code,
    redirect_uri: 'http://localhost:3000/omniauth' } }, (e, r, data) => {
        if (!e && r.statusCode == 200) {
            let user = JSON.parse(data);
            let header = 'Bearer ' + user.access_token;
            request.get({
              url: 'https://api.intra.42.fr/v2/me',
              headers: { Authorization: header }}, (e, r, data) => {
                let userdata = JSON.parse(data);
                let user = {
                'username': '42_' + userdata.login,
                'lastName': userdata.last_name,
                'firstName': userdata.first_name,
                'email': userdata.email,
                'id': userdata.id,
                'image_url': userdata.image_url,
                'key': 'z30MohzdcqIHx5o9zYl7Z85A'
                }
                userService.create(user)
                  .then(() => {
                    userService.authenticate42(userdata.id)
                      .then(user => {
                        if (user) {
                          res.send(user);
                        } else {
                          res.status(401).send('Error with 42 API');
                        }
                      })
                      .catch(err => res.status(400).send(err));})
                  .catch(err => {
                      userService.authenticate42(userdata.id)
                        .then(user => {
                          if (user) {
                            res.send(user);
                          } else {
                            res.status(401).send('Error with 42 API');
                          }
                        })
                        .catch(err => res.status(400).send(err));
                  });
              })
          } else {
            res.status(400).send(e)
          }
  });
})

module.exports = router;
