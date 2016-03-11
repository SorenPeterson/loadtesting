'use strict';
var loadtesting = require('./sorensloadtestingtool.js');
var Site = loadtesting.Site;
var TaskFlow = loadtesting.TaskFlow;

var site = new Site('http://local.marqeta.com/v3').auth('admin_consumer', 'marqeta')

var taskFlow = new TaskFlow().task('Create User', function (flow, site) {
    site.post('POST Users', '/users', {/*empty body*/}, function (response) {
        flow.data.user_token = JSON.parse(response.body)['token'];
        flow.goto('Fund User');
    })
}).task('Fund User', function (flow, site) {
  site.post('POST Gpa Orders', '/gpaorders', {
    user_token: flow.data.user_token,
    amount: 10000000,
    currency_code: 'USD'
  }, function (response) {
    flow.goto('Create Card');
  })
}).task('Create Card', function (flow, site) {
  site.post('POST Cards', '/cards', {
    user_token: flow.data.user_token,
    card_product_token: '86a4e6cf-6102-4895-bdab-d6fe0b18073b'
  }, function (response) {
    flow.data.card_token = JSON.parse(response.body)['token'];
    flow.goto('Simulate Authorization');
  })
}).task('Simulate Authorization', function (flow, site) {
  site.post('POST Sim Auth', '/simulate/authorization', {
    card_token: user.get('card_token'),
    mid: '1278917923789',
    amount: 5.0
  }, function (response) {
    flow.data.transaction_token = JSON.parse(response)['token'];
    flow.repeat();
  }, function (err, response) {
    if(JSON.parse(response)['error_message'] === 'Not sufficient funds') {
      flow.goto('Fund User').after(function () {
        flow.goto('Simulate Authorization');
      });
    } else {
      flow.goto('Simulate Authorization');
    }
  })
})

site.startFlow(taskFlow);
