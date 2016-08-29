'use strict';

var path = require('path');
var hexoPath = path.resolve('../_internal/app/frontend-hexo/frontend');
var modulesPath = path.resolve('../_internal/app/node_modules');
var minimist = require(path.join(modulesPath, 'minimist'));
var Hexo = require(path.join(modulesPath, 'hexo'));
var configFile = '_config.pkg.yml';

var hexo = new Hexo(hexoPath, {
  config: configFile
});

var args = minimist(process.argv.slice(2));
var cmd = args._.shift();

hexo.init().then(function() {
    return hexo.call(cmd, args);
}).then(function(response) {
    return hexo.exit();
}).catch(function(err) {
    return hexo.exit(err);
});
