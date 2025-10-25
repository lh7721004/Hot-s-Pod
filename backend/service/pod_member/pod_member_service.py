from repository.pod_member import pod_member_command_repository
from repository.pod_member import pod_member_query_repository
from pymysql import Connection

class PodMemberService:
    def __init__(self,db:Connection):
        self.db = db