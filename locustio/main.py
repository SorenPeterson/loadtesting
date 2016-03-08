import json
from locust import HttpLocust, TaskSet, task

class MapiTasks(TaskSet):
    def on_start(self):
        response = self.client.post("/users", json={}, auth=('admin_consumer', 'marqeta'), name="Create User")
        data = json.loads(response.content)
        self.user_token = data['token']
        response = self.client.post("/cards", json={'user_token': self.user_token, 'card_product_token': '86a4e6cf-6102-4895-bdab-d6fe0b18073b'}, auth=('admin_consumer', 'marqeta'))
        data = json.loads(response.content)
        self.card_token = data['token']
        
        
    @task
    def authorization(self):
        response = self.client.post("/simulate/authorization", json={'card_token': self.card_token, 'mid': '123491239158', 'amount': 5.0}, auth=('admin_consumer', 'marqeta'), name="Authorization")
        data = json.loads(response.content)
        original_transaction_token = data['transaction']['token']
        self.client.post("/simulate/clearing", json={'amount': 5.0, 'original_transaction_token': original_transaction_token}, auth=('admin_consumer', 'marqeta'), name="Clearing")
        
class MapiUser(HttpLocust):
    host = "http://local.marqeta.com:8080/v3"
    task_set = MapiTasks
    min_wait = 0
    max_wait = 0
