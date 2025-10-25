from repository.pod import pod_command_repository
from repository.pod import pod_query_repository
from pymysql import Connection

class PodService:
    def __init__(self,db:Connection):
        self.db = db
    def add_pod(self,pod):
        pod_command_repository.create_pod(pod)
    def get_pod(self,pod_id):
        self.cur.execute()
        return pod_id