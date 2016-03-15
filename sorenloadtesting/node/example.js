var Site = require('./sorensloadtestingtool.js');

var site = new Site('http://local.marqeta.com:8080/v3').auth('admin_consumer', 'marqeta').header('Content-Type', 'application/json');

var createUserAndGet = site.createTaskFlow('Create and Get User');

createUserAndGet.registerTask('Create User', function (goto, site, state) {
  site.post('POST Users', '/users', {/*empty body*/}, function (response, body) {
    state.user_token = JSON.parse(body)['token'];
    console.log('created user');
    goto('Get Users');
  }, function (error, response, body) {
  });
}).registerTask('Get Users', function (goto, site, state) {
  site.get('GET Users', '/users', function (response, body) {
    console.log('created user');
    goto('Get Users', 100);
  }, function (error, response, body) {
    console.log(error, response);
  });
});

createUserAndGet.startAtTask('Create User');
