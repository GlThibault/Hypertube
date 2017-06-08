'use strict';

const express = require('express');
const router = express.Router();
const config = require('../config.json');
const commentService = require('../services/comment.service');

// Apelle le service d'ajout de commentaire

router.post('/', (req, res) => {
	if (req.body.user && req.body.comment && req.body.magnet && req.body.magnet.magnetLink)
  	commentService.addComment(req.body.user, req.body.comment, req.body.magnet.magnetLink);
})

//

// Affiche les commentsaires precedents

router.post('/show', (req, res) => {
	if (req.body.magnet && req.body.magnet.magnetLink)
		commentService.showComment(req.body.magnet.magnetLink)
			.then(comments => {
				res.send(comments)
			});
})

//

module.exports = router;