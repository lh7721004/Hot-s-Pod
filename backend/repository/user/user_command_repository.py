from pymysql import Connection
from tables.Auth import User
class UserQueryRepository:
    def __init__(self,db:Connection):
        self.db = db
        self.cur = self.db.cursor()
    def create_user(user_id):
        pass