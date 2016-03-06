import json
from locust import HttpLocust, TaskSet, task

class MapiTasks(TaskSet):
    def on_start(self):
        response = self.client.post("/v3/users", json={}, auth=('admin_consumer', 'marqeta'))
        data = json.loads(response.content)
        self.token = data['token']
        
    @task
    def ping(self):
        self.client.get("/v3/ping")
        
    @task
    def users(self):
        self.client.get("/v3/users", auth=('admin_consumer', 'marqeta'))
        
    @task
    def more_users(self):
        self.client.get("/v3/users?count=100", auth=('admin_consumer', 'marqeta'))
        
class MapiUser(HttpLocust):
    host = "http://local.marqeta.com:8080"
    task_set = MapiTasks
    min_wait = 5000
    max_wait = 15000
