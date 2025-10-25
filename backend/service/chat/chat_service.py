from repository.chat import chat_command_repository
from repository.chat import chat_query_repository
from pymysql import Connection

class ChatService:
    def __init__(self,db:Connection):
        self.db = db