from repository.comment import comment_command_repository
from repository.comment import comment_query_repository
from pymysql import Connection

class CommentService:
    def __init__(self,db:Connection):
        self.db = db