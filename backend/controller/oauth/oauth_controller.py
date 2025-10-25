import requests
from fastapi import APIRouter,HTTPException,Depends
from pymysql import Connection
from database import get_db
from service.oauth.oauth_service import OAuthService
controller = APIRouter(prefix='/oauth',tags=['users'])
@controller.get("/")
async def oauthPage(user_id:str,db:Connection=Depends(get_db)):
    try:
        oauthService = OAuthService(db)
        oauthService.register_user(db)
        return oauthService.get_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400,detail="Something Went Wrong.")
@controller.get("/redirect")
async def oauth_redirect(code:str):
    try:
        requests.get()
    except Exception as e:
        raise HTTPException(status_code=400,detail="Something Went Wrong.")
