# app/schemas/oauth.py
from pydantic import BaseModel

class OAuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict