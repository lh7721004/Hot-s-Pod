from repository.user import user_command_repository
from repository.user import user_query_repository
from pymysql import Connection

class UserService:
    def __init__(self,db:Connection):
        self.db = db
    def register_user(self,user):
        user_command_repository.create_user(user)
    def get_user(self,user_id):
        self.cur.execute()
        return user_id