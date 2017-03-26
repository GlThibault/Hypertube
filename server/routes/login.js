const express = require('express');
const router = express.Router();

router.post('/', function(req, res) {
  console.log('login');
  res.send('login works');
});

module.exports = router;
