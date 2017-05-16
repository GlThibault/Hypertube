'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');

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
  res.send(req.files);
});

module.exports = router;