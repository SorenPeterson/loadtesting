var request = require('request');

var Site = function (url) {
  this.HTTPOptions = {};
  this.HTTPOptions.baseUrl = url;
  this.HTTPOptions.headers = {};
}

Site.taskFlows = {};

Site.prototype.auth = function (username, password) {
  this.HTTPOptions.auth = {
    user: username,
    pass: password
  }
  return this;
}

Site.prototype.header = function (key, value) {
  this.HTTPOptions.headers[key] = value;
  return this;
}

Site.prototype.get = function (tag, uri, success, failure) {
  success = success || function(){};
  failure = failure || function(){};
  var that = this;
  request.get(uri, this.HTTPOptions, function (error, response, body) {
    if(error || response.statusCode >= 300 || response.statusCode < 200) {
      failure(error, response, body);
    } else {
      success(response, body);
    }
  });
};

Site.prototype.post = function (tag, uri, body, success, failure) {
  success = success || function(){};
  failure = failure || function(){};
  this.HTTPOptions.body = body;
  var that = this;
  request.post(uri, this.HTTPOptions, function (error, response, body) {
    if(error || response.statusCode >= 300 || response.statusCode < 200) {
      failure(error, response, body);
    } else {
      success(response, body);
    }
  });
};

Site.prototype.createTaskFlow = function(name, fn) {
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
  
  var goto = function (title, timeout) {
    if(typeof that.taskData[title] !== 'function') {
      throw new Error('It appears as if you have not registered a task named ' + title);
    }
    setTimeout(function () {
      that.taskData[title](goto, that.site, state);
    }, timeout || 0);
  }
  
  goto(entryPoint);
}

module.exports = Site
