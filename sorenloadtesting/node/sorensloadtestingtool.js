var http = require('http');

var Request = function (callback) {
  callback.bind(this)();
  this.success = function () {};
  this.failure = function () {};
}

Request.prototype.success = function (callback) {
  this.success = callback;
}

Request.prototype.failure = function (callback) {
  this.failure = callback;
}

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

Site.prototype.get = (new Request(function () {
  setTimeout(function () {
    Math.floor(Math.random() * 2) ? this.success() : this.failure();
  }, Math.floor(Math.random() * 300);
})).call;

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
