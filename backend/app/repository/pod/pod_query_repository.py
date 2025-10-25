# app/repository/pod/pod_query_repository.py
from pymysql.connections import Connection
from typing import Optional, Dict, Any, List

class PodQueryRepository:
    def __init__(self, db: Connection):
        self.db = db

    def find_pod_by_id(self, pod_id: int) -> Optional[Dict[str, Any]]:
        with self.db.cursor() as cursor:
            sql = """
                SELECT p.*, u.username AS host_username
                FROM Pod p
                JOIN User u ON p.host_user_id = u.user_id
                WHERE p.pod_id = %s
            """
            cursor.execute(sql, (pod_id,))
            return cursor.fetchone()
    
    def find_all_pods(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        with self.db.cursor() as cursor:
            sql = """
                SELECT p.*, u.username AS host_username
                FROM Pod p
                JOIN User u ON p.host_user_id = u.user_id
                ORDER BY p.event_time DESC
                LIMIT %s OFFSET %s
            """
            cursor.execute(sql, (limit, offset))
            return cursor.fetchall()