'use strict';

const service = {};
const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');

service.search = (query, page) => {
    return new Promise((resolve) => {
        fetch(`https://thepiratebay.org/search/${encodeURIComponent(query)}/${page}/99/200`, {
                mode: 'no-cors'
            })
            .then(res => res.text())
            .then(showsHtml => {
                const $ = cheerio.load(showsHtml);
                const torrents = $('table#searchResult tr:has(a.detLink)').map(function formatTorrents() {
                    return {
                        magnetLink: $(this).find('[title="Download this torrent using magnet"]').attr('href'),
                        seeders: $(this).find('td[align="right"]').first().text(),
                        leechers: $(this).find('td[align="right"]').next().text(),
                        name: $(this).find('a.detLink').text(),
                        size: $(this).find('font').text().match(/Size (.+?),/)[1],
                        link: 'https://thepiratebay.org' + $(this).find('div.detName a').attr('href'),
                        id: String(parseInt(/^\/torrent\/(\d+)/.exec($(this).find('div.detName a').attr('href'))[1], 10)),
                        source: 'tpb'
                    };
                }).get();
                resolve(torrents);
            });
    });
};

module.exports = service;