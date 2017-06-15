'use strict';

const express = require('express');
const router = express.Router();
const request = require('request');
const userService = require('../services/user.service');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const key = require('../key.json');
const config = require('../config.json');

passport.use(new LinkedInStrategy({
    clientID: key.LinkedInclientID,
    clientSecret: key.LinkedInclientSecret,
    callbackURL: config.apiUrl + '/omniauth?source=linkedin',
    scope: ['r_emailaddress', 'r_basicprofile'],
}, (accessToken, refreshToken, profile, done) => {
    const user = {
        'username': 'LI_' + profile.displayName.replace(/\s/g, '_'),
        'lastName': profile.name.familyName,
        'firstName': profile.name.givenName,
        'email': profile.emails[0].value,
        'id': 'LI_' + profile.id,
        'image_url': profile.photos[0].value,
        'key': 'z30MohzdcqIHx5o9zYl7Z85A'
    };
    userService.create(user)
        .then(() => {
            userService.authenticateomniauth('LI_' + profile.id)
                .then(user => {
                    if (user) {
                        done(null, user);
                    } else
                        return done('Error with Linkedin API');
                })
                .catch(err => {
                    return done(err);
                });
        })
        .catch(() => {
            userService.authenticateomniauth('LI_' + profile.id)
                .then(user => {
                    if (user) {
                        done(null, user);
                    } else
                        return done('Error with Linkedin API');
                })
                .catch(err => {
                    return done(err);
                });
        });
}));

passport.use(new GoogleStrategy({
        clientID: key.GoogleclientID,
        clientSecret: key.GoogleclientSecret,
        callbackURL: config.apiUrl + '/omniauth?source=google'
    },
    (accessToken, refreshToken, profile, done) => {
        let userpic = '';
        if (profile.photos[0].value)
            userpic = profile.photos[0].value.substring(0, profile.photos[0].value.length - 6);
        const user = {
            'username': 'GG_' + profile.displayName.replace(/\s/g, '_'),
            'lastName': profile.name.familyName,
            'firstName': profile.name.givenName,
            'email': profile.emails[0].value,
            'id': 'GG_' + profile.id,
            'image_url': userpic,
            'key': 'z30MohzdcqIHx5o9zYl7Z85A'
        };
        userService.create(user)
            .then(() => {
                userService.authenticateomniauth('GG_' + profile.id)
                    .then(user => {
                        if (user) {
                            done(null, user);
                        } else
                            return done('Error with Google API');
                    })
                    .catch(err => {
                        return done(err);
                    });
            })
            .catch(() => {
                userService.authenticateomniauth('GG_' + profile.id)
                    .then(user => {
                        if (user) {
                            done(null, user);
                        } else
                            return done('Error with Google API');
                    })
                    .catch(err => {
                        return done(err);
                    });
            });
    }
));



passport.use(new FacebookStrategy({
        clientID: key.FBclientID,
        clientSecret: key.FBclientSecret,
        callbackURL: config.apiUrl + '/omniauth?source=fb',
        profileFields: ['id', 'first_name', 'last_name', 'displayName', 'email', 'picture.type(large)']
    },
    (accessToken, refreshToken, profile, done) => {
        let user = {
            'username': 'FB_' + profile.displayName.replace(/\s/g, '_'),
            'lastName': profile.name.familyName,
            'firstName': profile.name.givenName,
            'email': profile.emails[0].value,
            'id': 'FB_' + profile.id,
            'image_url': profile.photos[0].value,
            'key': 'z30MohzdcqIHx5o9zYl7Z85A'
        };
        userService.create(user)
            .then(() => {
                userService.authenticateomniauth('FB_' + profile.id)
                    .then(user => {
                        if (user)
                            done(null, user);
                        else
                            return done('Error with Facebook API');
                    })
                    .catch(err => {
                        return done(err);
                    });
            })
            .catch(() => {
                userService.authenticateomniauth('FB_' + profile.id)
                    .then(user => {
                        if (user) {
                            done(null, user);
                        } else
                            return done('Error with Facebook API');
                    })
                    .catch(err => {
                        return done(err);
                    });
            });
    }
));

router.get('/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
}));

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user) => {
        if (err)
            res.status(401).send('Error with Google API');
        else
            res.send(user);
    })(req, res, next);
});

router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));

router.get('/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', (err, user) => {
        if (err)
            res.status(401).send('Error with Facebook API');
        else
            res.send(user);
    })(req, res, next);
});

router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback', (req, res, next) => {
    passport.authenticate('linkedin', (err, user) => {
        if (err)
            res.status(401).send('Error with Linkedin API');
        else
            res.send(user);
    })(req, res, next);
});

router.get('/42', (req, res) => {
    request.post(
        'https://api.intra.42.fr/oauth/token', {
            form: {
                grant_type: 'authorization_code',
                client_id: key.C42clientID,
                client_secret: key.C42clientSecret,
                code: req.query.code,
                redirect_uri: config.apiUrl + '/omniauth'
            }
        }, (e, r, data) => {
            if (!e && r.statusCode == 200) {
                let user = JSON.parse(data);
                let header = 'Bearer ' + user.access_token;
                request.get({
                    url: 'https://api.intra.42.fr/v2/me',
                    headers: {
                        Authorization: header
                    }
                }, (e, r, data) => {
                    let userdata = JSON.parse(data);
                    let user = {
                        'username': '42_' + userdata.login,
                        'lastName': userdata.last_name,
                        'firstName': userdata.first_name,
                        'email': userdata.email,
                        'id': '42_' + userdata.id,
                        'image_url': userdata.image_url,
                        'key': 'z30MohzdcqIHx5o9zYl7Z85A'
                    };
                    userService.create(user)
                        .then(() => {
                            userService.authenticateomniauth('42_' + userdata.id)
                                .then(user => {
                                    if (user) {
                                        res.send(user);
                                    } else {
                                        res.status(401).send('Error with 42 API');
                                    }
                                })
                                .catch(err => res.status(400).send(err));
                        })
                        .catch(() => {
                            userService.authenticateomniauth('42_' + userdata.id)
                                .then(user => {
                                    if (user) {
                                        res.send(user);
                                    } else {
                                        res.status(401).send('Error with 42 API');
                                    }
                                })
                                .catch(err => res.status(400).send(err));
                        });
                });
            } else {
                res.status(400).send(e);
            }
        });
});

module.exports = router;