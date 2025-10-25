from fastapi import APIRouter,HTTPException,Depends
from pymysql import Connection
from database import get_db
from service.user.user_service import UserService
controller = APIRouter(prefix='/user')
@controller.get("/")
async def userPage(user_id:str,db:Connection=Depends(get_db)):
    try:
        user_service = UserService(db)
        user_service.register_user(db)
        return user_service.get_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400,detail="Something Went Wrong.")