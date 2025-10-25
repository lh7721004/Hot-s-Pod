# app/repository/pod_member/pod_member_query_repository.py
from pymysql.connections import Connection
from typing import List, Dict, Any

class PodMemberQueryRepository:
    def __init__(self, db: Connection):
        self.db = db
    
    def find_members_by_pod(self, pod_id: int) -> List[Dict[str, Any]]:
        """Pod의 모든 참가자 조회"""
        with self.db.cursor() as cursor:
            sql = """
                SELECT pm.*, u.username, u.phonenumber
                FROM Pod_Member pm
                JOIN User u ON pm.user_id = u.user_id
                WHERE pm.pod_id = %s
                ORDER BY pm.joined_at ASC
            """
            cursor.execute(sql, (pod_id,))
            return cursor.fetchall()
    
    def find_pods_by_user(self, user_id: int) -> List[Dict[str, Any]]:
        """사용자가 참가한 모든 Pod 조회"""
        with self.db.cursor() as cursor:
            sql = """
                SELECT p.*, pm.joined_at, pm.amount
                FROM Pod p
                JOIN Pod_Member pm ON p.pod_id = pm.pod_id
                WHERE pm.user_id = %s
                ORDER BY p.event_time DESC
            """
            cursor.execute(sql, (user_id,))
            return cursor.fetchall()
    
    def is_member(self, pod_id: int, user_id: int) -> bool:
        """사용자가 Pod 참가자인지 확인"""
        with self.db.cursor() as cursor:
            sql = "SELECT 1 FROM Pod_Member WHERE pod_id = %s AND user_id = %s"
            cursor.execute(sql, (pod_id, user_id))
            return cursor.fetchone() is not None
    
    def get_member_count(self, pod_id: int) -> int:
        """Pod 참가자 수 조회"""
        with self.db.cursor() as cursor:
            sql = "SELECT COUNT(*) as count FROM Pod_Member WHERE pod_id = %s"
            cursor.execute(sql, (pod_id,))
            result = cursor.fetchone()
            return result['count'] if result else 0