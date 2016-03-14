var Site = require('./sorensloadtestingtool.js');

var site = new Site('http://local.marqeta.com:8080/v3').auth('admin_consumer', 'marqeta')

var createUserAndGet = site.registerTaskFlow('Create and Get User');

createUserAndGet.registerTask('Create User', function (goto, site, state) {
  site.post('POST Users', '/users', {/*empty body*/}, function (response) {
    state.user_token = JSON.parse(response.body)['token'];
    state.doge = Math.random();
    console.log(response);
    goto('Get Users');
  }, function (error, response) {
    console.log(error, response);
  });
}).registerTask('Get Users', function (goto, site, state) {
  site.get('GET Users', '/users', function (response) {
    console.log(state.doge);
    goto('Get Users');
    console.log(response);
  }, function (error, response) {
    console.log(error, response);
  });
});

createUserAndGet.startAtTask('Create User');
