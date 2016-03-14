var Site = require('./sorensloadtestingtool.js');

var site = new Site('http://local.marqeta.com/v3').auth('admin_consumer', 'marqeta')

var createUserAndGet = site.registerTaskFlow('Create and Get User');

createUserAndGet.registerTask('Create User', function (goto, site, state) {
  site.post('POST Users', '/users', {/*empty body*/}, function (response) {
    state.user_token = JSON.parse(response.body)['token'];
    state.doge = Math.random();
    goto('Get Users');
  });
}).registerTask('Get Users', function (goto, site, state) {
  site.get('GET Users', '/users', function (response) {
    console.log(state.doge);
    goto('Get User');
  });
});

createUserAndGet.startFlow('Create User');
