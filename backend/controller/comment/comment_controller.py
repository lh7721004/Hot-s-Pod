import requests
from fastapi import APIRouter,HTTPException,Depends
from pymysql import Connection
from database import get_db
from service.comment.comment_service import CommentService
controller = APIRouter(prefix='/comment',tags=['users'])
@controller.get("/")
async def commentPage(user_id:str,db:Connection=Depends(get_db)):
    try:
        commentService = CommentService(db)
        commentService.register_user(db)
        return commentService.get_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400,detail="Something Went Wrong.")