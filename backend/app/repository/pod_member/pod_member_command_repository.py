# app/repository/pod_member/pod_member_command_repository.py
from pymysql.connections import Connection
from app.schemas.pod_member import PodMemberJoinRequest
from typing import Optional

class PodMemberCommandRepository:
    def __init__(self, db: Connection):
        self.db = db
    
    def join_pod(self, join_data: PodMemberJoinRequest) -> int:
        """Pod 참가"""
        with self.db.cursor() as cursor:
            sql = """
                INSERT INTO Pod_Member (user_id, pod_id, amount, place_start, place_end)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                join_data.user_id,
                join_data.pod_id,
                join_data.amount,
                join_data.place_start,
                join_data.place_end
            ))
            self.db.commit()
            return cursor.lastrowid
    
    def leave_pod(self, pod_id: int, user_id: int) -> bool:
        """Pod 탈퇴"""
        with self.db.cursor() as cursor:
            sql = "DELETE FROM Pod_Member WHERE pod_id = %s AND user_id = %s"
            cursor.execute(sql, (pod_id, user_id))
            self.db.commit()
            return cursor.rowcount > 0
    
    def update_member_info(
        self, 
        pod_id: int, 
        user_id: int, 
        amount: Optional[int] = None,
        place_start: Optional[str] = None,
        place_end: Optional[str] = None
    ) -> bool:
        """참가자 정보 업데이트"""
        with self.db.cursor() as cursor:
            updates = []
            params = []
            
            if amount is not None:
                updates.append("amount = %s")
                params.append(amount)
            if place_start is not None:
                updates.append("place_start = %s")
                params.append(place_start)
            if place_end is not None:
                updates.append("place_end = %s")
                params.append(place_end)
            
            if not updates:
                return False
            
            params.extend([pod_id, user_id])
            sql = f"UPDATE Pod_Member SET {', '.join(updates)} WHERE pod_id = %s AND user_id = %s"
            cursor.execute(sql, params)
            self.db.commit()
            return cursor.rowcount > 0