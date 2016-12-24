'use strict';
const url = require('url');

const cleanPath = path => path.replace(/\.git$/, '');

exports.extractUrl = pkg => {
	const urlObject = url.parse(pkg.repository.url);

	if (urlObject.host === 'github.com') {
		return `https://github.com${cleanPath(urlObject.path)}`;
	}

	return pkg.repository.url;
};
