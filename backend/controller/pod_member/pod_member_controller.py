import requests
from fastapi import APIRouter,HTTPException,Depends
from pymysql import Connection
from database import get_db
from service.pod_member.pod_member_service import PodMemberService
controller = APIRouter(prefix='/pod_member')
@controller.get("/")
async def pod_member_Page(user_id:str,db:Connection=Depends(get_db)):
    try:
        podMemberService = PodMemberService(db)
        podMemberService.register_user(db)
        return podMemberService.get_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400,detail="Something Went Wrong.")
