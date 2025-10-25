from repository.oauth import oauth_command_repository
from repository.oauth import oauth_query_repository
from pymysql import Connection

class OAuthService:
    def __init__(self,db:Connection):
        self.db = db