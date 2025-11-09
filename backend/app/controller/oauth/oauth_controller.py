# app/controller/oauth/oauth_controller.py
import requests
from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import RedirectResponse, JSONResponse
from pymysql.connections import Connection
from app.database import get_db_connection
from app.service.oauth.oauth_service import OAuthService
from app.utils.auth import create_access_token
from app.core.config import settings
from datetime import timedelta

router = APIRouter(prefix='/oauth', tags=['OAuth'])
# 어우씨 여기 하나도 모르겠다 ㅋㅋㅋ
@router.get("/kakao/login")
async def kakao_login():
    kakao_auth_url = (
        f"https://kauth.kakao.com/oauth/authorize"
        f"?client_id={settings.KAKAO_REST_API_KEY}"
        f"&redirect_uri={settings.KAKAO_REDIRECT_URI}"
        f"&response_type=code"
    )
    
    return RedirectResponse(url=kakao_auth_url)

@router.get("/kakao/callback")
async def kakao_callback(
    code: str = Query(..., description="카카오 인가 코드"),
    db: Connection = Depends(get_db_connection)
):
    try:
        token_data = {
            "grant_type": "authorization_code",
            "client_id": settings.KAKAO_REST_API_KEY,
            "redirect_uri": settings.KAKAO_REDIRECT_URI,
            "code": code,
        }
        
        if settings.KAKAO_CLIENT_SECRET:
            token_data["client_secret"] = settings.KAKAO_CLIENT_SECRET
        
        token_response = requests.post(
            "https://kauth.kakao.com/oauth/token",
            headers={"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
            data=token_data,
            timeout=10
        )
        token_response.raise_for_status()
        tokens = token_response.json()
        
        profile_response = requests.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={
                "Authorization": f"Bearer {tokens['access_token']}",
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            timeout=10
        )
        profile_response.raise_for_status()
        kakao_profile = profile_response.json()
        
        oauth_service = OAuthService(db)
        user_info = oauth_service.kakao_login_or_register(kakao_profile, tokens)
        
        access_token = create_access_token(
            data={"user_id": user_info['user_id'], "username": user_info['username']},
            expires_delta=timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        # 프론트엔드로 리다이렉트
        frontend_url = f"{settings.FRONTEND_URL}/oauth/callback?token={access_token}&is_new_user={user_info['is_new_user']}"
        return RedirectResponse(url=frontend_url)
    
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=400, detail="카카오 로그인 처리 중 오류가 발생했습니다.")
    except ValueError:
        raise HTTPException(status_code=400, detail="잘못된 요청입니다.")
    except Exception:
        raise HTTPException(status_code=500, detail="서버 오류가 발생했습니다.")

@router.get("/logout")
async def logout(access_token: str = Query(..., description="카카오 액세스 토큰")):
    try:
        logout_response = requests.post(
            "https://kapi.kakao.com/v1/user/logout",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10
        )
        logout_response.raise_for_status()
        return {"message": "로그아웃 성공"}
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=400, detail="카카오 로그아웃 처리 중 오류가 발생했습니다.")