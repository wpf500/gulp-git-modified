var exec = require('child_process').exec;
var path = require('path');
var through = require('through2');

var batchReplace = require('gulp-batch-replace');

var cache = {};

function modified(basePath) {
    basePath = basePath || '.';

    return through.obj(function (file, enc, callback) {
        if (file.isDirectory()) {
            callback(null, file);
        } else {
            exec('git log -1 --pretty=format:%at "' + file.path + '"', {}, function (e, out) {
                var filePath = './' + path.join(basePath, file.relative);
                cache[filePath] = filePath + '?v=' + out.trim();
                callback(null, file);
            });
        }
    });
}

module.exports = modified;
module.exports.replace = function () {
    var replace = [];

    for (var key in cache) {
        replace.push([key, cache[key]]);
    }

    return batchReplace(replace);
};
