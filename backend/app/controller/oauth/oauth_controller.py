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

@router.get("/kakao/login")
async def kakao_login():
    """카카오 로그인 페이지로 리디렉션"""
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
    """
    카카오 로그인 콜백
    1. 토큰 발급
    2. 사용자 정보 조회
    3. 로그인/회원가입
    4. JWT 발급
    """
    try:
        # Step 1: 카카오 액세스 토큰 발급
        token_response = requests.post(
            "https://kauth.kakao.com/oauth/token",
            headers={"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
            data={
                "grant_type": "authorization_code",
                "client_id": settings.KAKAO_REST_API_KEY,
                "redirect_uri": settings.KAKAO_REDIRECT_URI,
                "code": code,
                "client_secret": settings.KAKAO_CLIENT_SECRET
            },
            timeout=10
        )
        token_response.raise_for_status()
        tokens = token_response.json()
        
        # Step 2: 카카오 사용자 정보 조회
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
        
        # Step 3: 로그인/회원가입
        oauth_service = OAuthService(db)
        user_info = oauth_service.kakao_login_or_register(kakao_profile, tokens)
        
        # Step 4: JWT 토큰 발급
        access_token = create_access_token(
            data={"user_id": user_info['user_id'], "username": user_info['username']},
            expires_delta=timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return JSONResponse(content={
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "user_id": user_info['user_id'],
                "username": user_info['username'],
                "profile_picture": user_info.get('profile_picture'),
                "is_new_user": user_info['is_new_user']
            }
        })
    
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"카카오 API 요청 실패: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")

@router.get("/logout")
async def logout(access_token: str = Query(..., description="카카오 액세스 토큰")):
    """카카오 로그아웃"""
    try:
        logout_response = requests.post(
            "https://kapi.kakao.com/v1/user/logout",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10
        )
        logout_response.raise_for_status()
        return {"message": "로그아웃 성공"}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"카카오 로그아웃 실패: {str(e)}")