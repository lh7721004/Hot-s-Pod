import requests
from fastapi import APIRouter,HTTPException,Depends
from pymysql import Connection
from database import get_db
from service.pod.pod_service import PodService
controller = APIRouter(prefix='/pod')
@controller.get("/")
async def podPage(user_id:str,db:Connection=Depends(get_db)):
    try:
        podService = PodService(db)
        podService.register_user(db)
        return podService.get_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400,detail="Something Went Wrong.")
