'use strict'

var path = require('path');
var hexoPath = path.resolve('../_internal/app/frontend-hexo/frontend');
var minimist = require(path.join(hexoPath, 'node_modules', 'minimist'));
var Hexo = require(path.join(hexoPath, 'node_modules', 'hexo'));
var configFile = '_config.prod.yml'

var hexo = new Hexo(hexoPath, {
  config: configFile
});

var args = minimist(process.argv.slice(2));
var cmd = args._.shift();

hexo.init().then(function() {
//     return hexo.watch();
// }).then(function() {
    return hexo.call(cmd, args);
}).then(function() {
    return hexo.exit();
}).catch(function(err) {
    return hexo.exit(err);
});
