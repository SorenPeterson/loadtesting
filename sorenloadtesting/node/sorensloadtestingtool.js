var http = require('http');

var Site = function (url) {
  this.url = url;
}

Site.prototype.auth = function (username, password) {
  encoded = 'Basic ' + new Buffer(username + ':' + password)
  this.headers.Authorization = encoded
}

Site.prototype.header = function (key, value) {
  this.headers[key] = value
}

module.exports = function() {
}
