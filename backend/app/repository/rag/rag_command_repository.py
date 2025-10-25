# app/repository/rag/rag_command_repository.py
from pymysql.connections import Connection
from typing import List, Dict, Any

class RagCommandRepository:
    def __init__(self, db: Connection):
        self.db = db

    def get_pending_jobs(self, limit: int = 10) -> List[Dict[str, Any]]:
        jobs = []
        with self.db.cursor() as cursor:
            try:
                sql_select = """
                    SELECT queue_id, pod_id, action_type 
                    FROM VectorSyncQueue 
                    WHERE status = 'pending' 
                    ORDER BY created_at ASC 
                    LIMIT %s 
                    FOR UPDATE
                """
                cursor.execute(sql_select, (limit,))
                jobs = cursor.fetchall()

                if not jobs:
                    return []

                queue_ids = [job['queue_id'] for job in jobs]
                placeholders = ','.join(['%s'] * len(queue_ids))
                update_sql = f"UPDATE VectorSyncQueue SET status = 'processing' WHERE queue_id IN ({placeholders})"
                cursor.execute(update_sql, queue_ids)
                self.db.commit()
                
                return jobs

            except Exception as e:
                self.db.rollback()
                raise e

    def delete_job(self, queue_id: int):
        with self.db.cursor() as cursor:
            sql = "DELETE FROM VectorSyncQueue WHERE queue_id = %s"
            cursor.execute(sql, (queue_id,))
            self.db.commit()

    def update_job_status(self, queue_id: int, status: str = 'failed'):
        with self.db.cursor() as cursor:
            sql = "UPDATE VectorSyncQueue SET status = %s, retry_count = retry_count + 1 WHERE queue_id = %s"
            cursor.execute(sql, (status, queue_id))
            self.db.commit()