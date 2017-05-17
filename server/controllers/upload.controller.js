'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const userService = require('../services/user.service');

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './server/public');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'image/png' &&
    file.mimetype !== 'image/jpg' &&
    file.mimetype !== 'image/jpeg' &&
    file.mimetype !== 'image/gif') {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  fileFilter: fileFilter,
  storage: storage
});

router.post('/', upload.array('uploads[]', 1), (req, res) => {
  let user = JSON.parse(req.body.user);
  user.image_url = 'http://localhost:3000/public/' + req.files[0].filename;
  userService.update(user._id, user)
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res.status(401).send('Error');
      }
    })
    .catch(err => res.status(400).send(err));
});

module.exports = router;