# init_db.py
import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

from app.ddl.DDL import execute_ddl

def init_database():
    """데이터베이스를 초기화합니다."""
    try:
        connection = pymysql.connect(
            host=os.getenv("DATABASE_HOST"),
            port=int(os.getenv("DATABASE_PORT")),
            user=os.getenv("DATABASE_USER"),
            password=os.getenv("DATABASE_PASSWORD"),
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        print("🔄 Executing DDL scripts...")
        execute_ddl(connection)
        
        connection.close()
        print("✅ Database initialization completed!")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise

if __name__ == "__main__":
    init_database()