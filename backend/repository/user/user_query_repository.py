from pymysql import Connection
from tables.Auth import User
class UserQueryRepository:
    def __init__(self,db:Connection):
        self.db = db
        self.cur = self.db.cursor()
    def find_user_by_user_id(user_id):
        pass