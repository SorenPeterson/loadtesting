var request = require('request');

var Request = function (callback) {
  this.callback = callback.bind(this);
  this.success = function () {};
  this.failure = function () {};
}

Request.prototype.success = function (callback) {
  this.success = callback;
}

Request.prototype.failure = function (callback) {
  this.failure = callback;
}

Request.prototype.call = function () {
  console.log(this);
  this.callback(arguments)
}

var Site = function (url) {
  this.url = url;
  this.headers = {};
}

Site.taskFlows = {};

Site.prototype.auth = function (username, password) {
  encoded = 'Basic ' + new Buffer(username + ':' + password)
  this.headers.Authorization = encoded
  return this;
}

Site.prototype.header = function (key, value) {
  this.headers[key] = value;
}

Site.prototype.get = function (tag, url, success, failure) {
  success = success || function(){};
  failure = failure || function(){};
  var that = this;
  // setTimeout(function () t {
  //   success({body:'{}'});
  // }, Math.floor(Math.random() * 300));
};

Site.prototype.post = function (tag, url, body, success, failure) {
  console.log(tag);
  success = success || function(){};
  failure = failure || function(){};
  var that = this;
  setTimeout(function () {
    success({body:'{}'});
  }, Math.floor(Math.random() * 300));
};

Site.prototype.registerTaskFlow = function(name, fn) {
  if(Site.taskFlows[name] !== undefined) {
    throw new Error("Duplicate task flow name was defined. TaskFlows can't have the same name.");
  }
  return Site.taskFlows[name] = new TaskFlow(this);
};

var TaskFlow = function (site) {
  this.taskData = {};
  this.data = {};
  this.site = site;
}

TaskFlow.prototype.registerTask = function (title, callback) {
  if(this.taskData[title] !== undefined) {
    throw new Error("Duplicate task name was defined. Tasks can't have the same name");
  }
  this.taskData[title] = callback;
  return this;
}

TaskFlow.prototype.startFlow = function (entryPoint) {
  var state = {};
  var that = this;
  
  var goto = function (title) {
    setTimeout(function () {
      that.taskData[title](goto, that.site, state);
    }, 0);
  }
  
  goto(entryPoint);
}

module.exports = Site
