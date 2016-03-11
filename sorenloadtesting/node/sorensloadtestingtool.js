var http = require('http');

var Site = function (url) {
  this.url = url;
  this.headers = {};
}

Site.prototype.auth = function (username, password) {
  encoded = 'Basic ' + new Buffer(username + ':' + password)
  this.headers.Authorization = encoded
  return this;
}

Site.prototype.header = function (key, value) {
  this.headers[key] = value;
}

Site.prototype.startFlow = function (taskFlow) {
  taskFlow.goto(taskFlow.firstTask);
}

Site.prototype.get = function (endpoint) {
  setTimeout(function () {
  }, Math.floor(Math.random() * 300);
}

Site.prototype.post = function (endpoint, body) {
  setTimeout(function () {
  }, Math.floor(Math.random() * 300);
}

var TaskFlow = function () {
  this.taskData = {};
  this.data = {};
}

TaskFlow.prototype.task = function (title, callback) {
  if(this.firstTask === undefined) {
    this.firstTask = title;
  }
  if(this.taskData[title] !== undefined) {
    throw new Error("Duplicate task name was defined. Tasks can't have the same name");
  }
  this.taskData[title] = callback;
  return this;
}

TaskFlow.prototype.goto = function (title) {
  setTimeout(function () {
    this.taskData[title](this, Request);
  }, 1000);
}

module.exports = {
  TaskFlow: TaskFlow,
  Site: Site
}
