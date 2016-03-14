'use strict';
var loadtesting = require('./sorensloadtestingtool.js');
var Site = loadtesting.Site;
var TaskFlow = loadtesting.TaskFlow;

var site = new Site('http://local.marqeta.com/v3').auth('admin_consumer', 'marqeta')

var authorizationFlow = site.registerTaskFlow('Simple Authorization');

authorizationFlow.registerTask('Create User', function (flow, site, state) {
  site.post('POST Users', '/users', {/*empty body*/}, function (response) {
    state.user_token = JSON.parse(response.body)['token'];
    flow.goto('Get Users');
  });
}).registerTask('Get Users', function (flow, site, state) {
  site.get('GET Users', '/users', function (response) {
    flow.goto('Get Users');
  });
});

authorizationFlow.startFlow('Simple Auhorization', 'Create User');
