'use strict';
var loadtesting = require('./sorensloadtestingtool.js')
var Site = loadtesting.Site;
var TaskFlow = loadtesting.TaskFlow;

var site = new Site('http://local.marqeta.com/v3').auth('admin_consumer', 'marqeta')

var taskFlow = new TaskFlow().task('Create User', function (user, flow, request) {
    request.post('POST Users', '/users', {/*empty body*/}).success(function (response) {
        user.set('user_token', JSON.parse(response.body)['token']);
        flow.next();
    }).failure(function (err, response) {
      flow.exit();
    });
}).task('Fund User', function (user, flow, request) {
  request.post('POST Gpa Orders', '/gpaorders', {
    user_token: user.get('user_token'),
    amount: 10000000,
    currency_code: 'USD'
  }).success(function (response) {
    flow.next();
  }).failure(function (err, response) {
    flow.exit();
  });
}).task('Create Card', function (user, flow, request) {
  request.post('POST Cards', '/cards', {
    user_token: user.get('user_token'),
    card_product_token: '86a4e6cf-6102-4895-bdab-d6fe0b18073b'
  }).success(function (response) {
    user.set('card_token', JSON.parse(response.body)['token']);
    flow.next();
  }).failure(function (err, response) {
    flow.exit();
  });
}).task('Simulate Authorization', function (user, flow, request) {
  request.post('POST Sim Auth', '/simulate/authorization', {
    card_token: user.get('card_token'),
    mid: '1278917923789',
    amount: 5.0
  }).success(function (response) {
    user.set('transaction_token', JSON.parse(response)['token']);
    flow.repeat();
  }).failure(function (err, response) {
    if(JSON.parse(response)['error_message'] === 'Not sufficient funds') {
      flow.goto('Fund User').after(function () {
        flow.goto('Simulate Authorization');
      });
    } else {
      flow.repeat();
    }
  })
})

for (var i = 0; i < 100; i++) {
  site.startFlow(taskFlow);
}
