var http = require('http');

var Site = function (url) {
  this.url = url;
}

Site.prototype.auth = function (username, password) {
  this.headers['Authorization'] = 'Ba'
}

module.exports = function() {
}
