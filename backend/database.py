import pymysql
import os
import dotenv
conn = None
def get_db():
    global conn
    if conn!=None:
        return conn
    dotenv.load_dotenv()
    conn = pymysql.connect(host=os.getenv("DATABASE_HOST"),port=int(os.getenv("DATABASE_PORT")), user=os.getenv("DATABASE_USER"), password=os.getenv("DATABASE_PASSWORD"), 
                            db=os.getenv("DATABASE_NAME"), charset="utf8", cursorclass=pymysql.cursors.DictCursor)
    return conn