var http = require('http');

var Site = function (url) {
  this.url = url;
  this.headers = {};
}

Site.prototype.auth = function (username, password) {
  encoded = 'Basic ' + new Buffer(username + ':' + password)
  this.headers.Authorization = encoded
}

Site.prototype.header = function (key, value) {
  this.headers[key] = value
}

Site.prototype.runFlow = function (taskFlow) {
}

var Flow = function () {
}

Flow.prototype.next = function () {
}

var TaskFlow = function () {
  this.taskList = [];
  this.taskData = {};
}

TaskFlow.prototype.task = function (title, callback) {
  if(this.taskData[title] !== undefined) {
    throw new Error("Duplicate task name was defined. Tasks can't have the same name");
  }
  this.taskList.push(title);
  this.taskData[title] = callback;
}

module.exports = {
  TaskFlow: TaskFlow,
  Site: Site
}
