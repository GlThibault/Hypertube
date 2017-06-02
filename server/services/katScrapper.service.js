'use strict';

const service = {};
const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');
const config = require('../config.json');

service.search = (query, callback) => {
    return fetch(`${config.katendpoint}/usearch/${encodeURIComponent(query)}/?field=seeders&sorder=desc`, {
            mode: 'no-cors'
        })
        .then(res => res.text())
        .then(showsHtml => {
            const $ = cheerio.load(showsHtml);
            const torrents = $("table.data tr:not('.firstr')").map(function formatTorrents() {
                return {
                    leechers: parseInt($(this).find('.red.lasttd.center').text(), 10),
                    magnetLink: $(this).find('[title="Torrent magnet link"]').attr('href'),
                    metadata: $(this).find('[title="Torrent magnet link"]').attr('href'),
                    seeders: parseInt($(this).find('.green.center').text(), 10),
                    name: $(this).find('a.cellMainLink').text(),
                    verified: !!$(this).find('[title="Verified Torrent"]').length,
                    size: $(this).find('.nobr.center').text(),
                    link: config.katendpoint + $(this).find('.cellMainLink').attr('href'),
                    id: $(this).find('.cellMainLink').attr('href').substring(1, $(this).find('.cellMainLink').attr('href')),
                    source: 'kat'
                };
            }).get();
            callback(torrents);
        });
};

service.searchtop = (callback) => {
    return fetch(`${config.katendpoint}/movies/?field=seeders&sorder=desc`, {
            mode: 'no-cors'
        })
        .then(res => res.text())
        .then(showsHtml => {
            const $ = cheerio.load(showsHtml);
            const torrents = $("table.data tr:not('.firstr')").map(function formatTorrents() {
                return {
                    leechers: parseInt($(this).find('.red.lasttd.center').text(), 10),
                    magnetLink: $(this).find('[title="Torrent magnet link"]').attr('href'),
                    metadata: $(this).find('[title="Torrent magnet link"]').attr('href'),
                    seeders: parseInt($(this).find('.green.center').text(), 10),
                    name: $(this).find('a.cellMainLink').text(),
                    verified: !!$(this).find('[title="Verified Torrent"]').length,
                    size: $(this).find('.nobr.center').text(),
                    link: config.katendpoint + $(this).find('.cellMainLink').attr('href'),
                    id: $(this).find('.cellMainLink').attr('href').substring(1, $(this).find('.cellMainLink').attr('href').length - 5),
                    source: 'kat'
                };
            }).get();
            callback(torrents);
        });
};

service.getTorrent = (torrentid, callback) => {
    return fetch(`${config.katendpoint}/${torrentid}.html`, {
            mode: 'no-cors'
        })
        .then(res => res.text())
        .then(showsHtml => {
            const $ = cheerio.load(showsHtml);
            const torrent = $("table.data tr:not('.firstr')").map(function formatTorrents() {
                return {
                    magnetLink: $(this).find('[title="Magnet link"]').attr('href')
                };
            }).get();
            callback(torrent);
        });
};
module.exports = service;