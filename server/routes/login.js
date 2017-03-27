var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);
  res.send('login works');
});

module.exports = router;
