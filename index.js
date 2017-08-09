var exec = require('child_process').exec;
var through = require('through2');

function modified() {
    return through.obj(function (file, enc, callback) {
        if (!file.isDirectory()) {
            exec('git log -1 --pretty=format:%at "' + file.path + '"', {}, function (e, out) {
                file.modified = out.trim();
                callback(null, file);
            });
        }

        callback();
    });
}

module.exports = modified;
