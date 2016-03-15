// This just pulls in the library
var Site = require('./sorensloadtestingtool.js');

// Everything starts with a site definition. This is where you configure the baseurl, authentication, headers, etc. The site follows a monadic pattern by returning itself from these configuration functions and allows you to chain settings.
var site = new Site('http://local.marqeta.com:8080/v3').auth('admin_consumer', 'marqeta').header('Content-Type', 'application/json');

// Task flows are a class that is not exposed by the library. Since it only makes sense to have a task flow that uses a particular site, you can create one through a site method. The only parameter that the flow will accept is a title.
var createUserAndGet = site.createTaskFlow('Create and Get User');

// You can register individual tasks on a task flow. The first argument is a title for the task and the second is the function to be called when the task needs to be executed.
// The task callback takes three arguments:
//    goto is a function that allows you to tell the flow where to go next
//    site is a reference to the site defined earlier. site contains all of the useful HTTP methods that you need
//    state is an object that is created at the time of startAtTask and persists through all tasks. It is unique to a task flow instance and allows you to store data that would be specific to one particular emulated user.
createUserAndGet.registerTask('Create User', function (goto, site, state) {
  var tag = 'POST Users';
  var endpoint = '/users';
  var body = JSON.stringify({/*empty body*/});
  var success = function (response, body) {
    state.user_token = JSON.parse(body)['token'];
    console.log('created user');
    // Pass a task identifier to go to that task next
    // Since we now have a user token stored in our emulated users state, we can go to the Get Users task to grab that user
    goto('Get Users');
  };
  var failure = function (error, response, body) {
    console.log(error, response, body);
  }
  // This post method will automatically track the response time of the request and group the results by the tag; defined as the first parameter.
  site.post(tag, endpoint, body, success, failure);
}).registerTask('Get Users', function (goto, site, state) {
  // Arguments: tag, endpoint, success callback, failure callback
  site.get('GET Users', '/users', function (response, body) {
    console.log('got users');
    // Notice here that goto can take an optional second which allows you to "pause" before executing the next Task. Note that the pause is NONBLOCKING because it utilizes the setTimeout function.
    goto('Get Users', 100);
  }, function (error, response, body) {
    console.log(error, response, body);
  });
  // Note that the failure call back is not required. In fact, neither is the success callback. If you do not provide any callbacks, and never call goto, the flow will just stop and the automatic garbage collection will clean up after you.
});

// To create an instance of a task flow, call startAtTask and pass the tag of the task that you would like to start at.
  createUserAndGet.startAtTask('Create User');
