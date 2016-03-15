var Site = require('./sorensloadtestingtool.js');

var site = new Site('http://local.marqeta.com:8080/v3').auth('admin_consumer', 'marqeta')

var createUserAndGet = site.createTaskFlow('Create and Get User');

createUserAndGet.registerTask('Create User', function (goto, site, state) {
  site.post('POST Users', '/users', {/*empty body*/}, function (response, body) {
    console.log(response.statusCode);
    state.user_token = JSON.parse(body)['token'];
    goto('Get Users');
  }, function (error, response, body) {
    console.log(response.statusCode, body);
  });
}).registerTask('Get Users', function (goto, site, state) {
  site.get('GET Users', '/users', function (response, body) {
    goto('Get Users', 100);
  }, function (error, response, body) {
    console.log(error, response);
  });
});

createUserAndGet.startAtTask('Create User');
