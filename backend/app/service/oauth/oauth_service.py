# app/service/oauth/oauth_service.py
from pymysql.connections import Connection
from app.repository.oauth.oauth_command_repository import OAuthCommandRepository
from app.repository.oauth.oauth_query_repository import OAuthQueryRepository
from app.repository.user.user_command_repository import UserCommandRepository
from typing import Dict, Any

class OAuthService:
    def __init__(self, db: Connection):
        self.db = db
        self.oauth_command = OAuthCommandRepository(db)
        self.oauth_query = OAuthQueryRepository(db)
        self.user_command = UserCommandRepository(db)
    
    def kakao_login_or_register(
        self, 
        kakao_profile: Dict[str, Any], 
        tokens: Dict[str, str]
    ) -> Dict[str, Any]:
        k_id = kakao_profile['id']
        user_name = kakao_profile['properties']['nickname']
        profile_picture = kakao_profile['properties'].get('profile_image_url', '')
        
        existing_user = self.oauth_query.find_user_by_kakao_id(k_id)
        
        if existing_user:
            user_id = existing_user['user_id']
            is_new_user = False
        else:
            user_id = self.user_command.create_user(username=user_name)
            is_new_user = True
        
        self.oauth_command.upsert_kakao_user(
            k_id=k_id,
            user_id=user_id,
            access_token=tokens.get('access_token', ''),
            refresh_token=tokens.get('refresh_token', ''),
            user_name=user_name,
            profile_picture=profile_picture
        )
        
        return {
            "user_id": user_id,
            "username": user_name,
            "is_new_user": is_new_user,
            "profile_picture": profile_picture
        }