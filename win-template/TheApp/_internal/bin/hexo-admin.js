'use strict';

var path = require('path');
var hexoPath = path.resolve('../_internal/app/frontend-hexo/frontend');
var modulesPath = path.join(hexoPath, 'node_modules');
var minimist = require(path.join(modulesPath, 'minimist'));
var Hexo = require(path.join(modulesPath, 'hexo'));
var opn = require(path.join(modulesPath, 'opn'));
var configFile = '_config.pkg.yml';

var hexo = new Hexo(hexoPath, {
  config: configFile
});

var args = minimist(process.argv.slice(2));
var cmd = args._.shift();
var isOpen = false;

hexo.on('generateAfter', function () {
	if (!isOpen) {
		isOpen = true;
		opn('http://localhost:4000/admin/');
	}
});

hexo.init().then(function() {
    return hexo.call('server', args);
}).then(function() {
    return hexo.exit();
}).catch(function(err) {
    return hexo.exit(err);
});
