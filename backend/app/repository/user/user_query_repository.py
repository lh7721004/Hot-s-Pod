# app/repository/user/user_query_repository.py
from pymysql.connections import Connection
from typing import Optional, Dict, Any

class UserQueryRepository:
    def __init__(self, db: Connection):
        self.db = db
    
    def find_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        with self.db.cursor() as cursor:
            sql = "SELECT * FROM User WHERE user_id = %s"
            cursor.execute(sql, (user_id,))
            return cursor.fetchone()