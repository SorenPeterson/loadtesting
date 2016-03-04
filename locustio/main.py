from locust import HttpLocust, TaskSet, task

class MapiTasks(TaskSet):
    def on_start(self):
        pass
        
    def index(self):
        self.client.get("/")
        
class MapiUser(HttpLocust):
    task_set = WebsiteTasks
