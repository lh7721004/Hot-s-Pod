# app/schemas/oauth.py
from pydantic import BaseModel

#어우 예 잘부탁해요
class OAuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict