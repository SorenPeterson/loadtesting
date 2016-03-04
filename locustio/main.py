import json
from locust import HttpLocust, TaskSet, task

class MapiTasks(TaskSet):
    config = {
        'auth': ('admin_consumer', 'marqeta')
    }
    
    def on_start(self):
        print self.config
        response = self.client.post("/v3/users", auth = ('admin_consumer', 'marqeta'))
        data = json.loads(response.content)
        print data
        self.token = data['token']
        
    @task
    def ping(self):
        self.client.get("/v3/ping")
        
    @task
    def users(self):
        self.client.get("/v3/users/%(self.token)" % locals(), auth = ('admin_consumer', 'marqeta'))
        
    @task
    def authorization(self):
        body = {
            'amount': 100,
            'mid': '12341234',
            'card_token': 'doge',
        }
        self.client.post('/v3/simulate/authorization', auth = ('admin_consumer', 'marqeta'))
        
class MapiUser(HttpLocust):
    host = "http://local.marqeta.com:8080"
    task_set = MapiTasks
    min_wait = 5000
    max_wait = 15000
