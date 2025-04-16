from locust import HttpUser, task, between
import json
import random
from datetime import datetime

class EvaluateUser(HttpUser):
    wait_time = between(1, 2)  # Wait time between requests

    @task
    def evaluate_api(self):
        # Random user/question data (adjust if needed)
        payload = {
            "user_answer": "SELECT * FROM projects",  # mock query
            "sql_mode": "postgresql",
            "ddl": False
        }

#    query: user_answer, sql_mode, ddl

        headers = {"Content-Type": "application/json"}

        self.client.post("http://localhost:3000/api/execute-participant", data=json.dumps(payload), headers=headers)

        
