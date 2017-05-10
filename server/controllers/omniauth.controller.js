const express = require('express');
const router = express.Router();
const request = require('request');
const userService = require('../services/user.service');

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
                'key': 'z30MohzdcqIHx5o9zYl7Z85A'
                }
                userService.create(user)
                  .then(() => {
                    userService.authenticate42('42_' + userdata.login, userdata.id)
                      .then(user => {
                        if (user) {
                          res.send(user);
                        } else {
                          res.status(401).send('Error with 42 API');
                        }
                      })
                      .catch(err => res.status(400).send(err));})
                  .catch(err => {
                      userService.authenticate42('42_' + userdata.login, userdata.id)
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
