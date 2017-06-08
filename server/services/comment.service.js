'use strict';

const config = require('../config.json');
const mongo = require('mongoskin');
const db = mongo.db(config.connectionString, {
	native_parser: true
});
db.bind('comments');

const service = {};

// Ajoute le commentaire a la db (table comment)

const addComment = (user, comment, magnet) => {
	db.comments.insert({
		user: user._id,
		comment: comment,
		magnet: magnet,
		image: user.image_url,
		name: user.username
	});

};

//

const showComment = magnet => {
	return new Promise((resolve) => {
		db.comments.find({
			magnet: magnet
		}).toArray((err, comments) => resolve(comments));
	});
};

service.showComment = showComment;
service.addComment = addComment;

module.exports = service;