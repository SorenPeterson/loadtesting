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
  this.HTTPOptions = {};
  this.HTTPOptions.baseUrl = url;
  this.HTTPOptions.headers = {};
}

Site.taskFlows = {};

Site.prototype.auth = function (username, password) {
  encoded = 'Basic ' + new Buffer(username + ':' + password)
  this.HTTPOptions.headers.Authorization = encoded
  return this;
}

Site.prototype.header = function (key, value) {
  this.HTTPOptions.headers[key] = value;
}

Site.prototype.get = function (tag, uri, success, failure) {
  success = success || function(){};
  failure = failure || function(){};
  this.HTTPOptions.uri = uri;
  this.HTTPOptions.url = uri;
  var that = this;
  console.log(this.HTTPOptions);
  request.get(this.HTTPOptions, function (error, response, body) {
    if(error) {
      failure(error, response);
    } else {
      success(response);
    }
  });
};

Site.prototype.post = function (tag, uri, body, success, failure) {
  success = success || function(){};
  failure = failure || function(){};
  this.HTTPOptions.uri = uri;
  this.HTTPOptions.url = uri;
  var that = this;
  console.log('doge', this.HTTPOptions);
  request.post(this.HTTPOptions, function (error, response, body) {
    if(error) {
      failure(error, response);
    } else {
      success(response);
    }
  });
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

TaskFlow.prototype.startAtTask = function (entryPoint) {
  var state = {};
  var that = this;
  
  var goto = function (title) {
    if(typeof that.taskData[title] !== 'function') {
      throw new Error('It appears as if you have not registered a task named ' + title);
    }
    setTimeout(function () {
      that.taskData[title](goto, that.site, state);
    }, 0);
  }
  
  goto(entryPoint);
}

module.exports = Site
