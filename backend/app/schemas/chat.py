# app/schemas/chat.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class ChatMessageCreate(BaseModel):
    pod_id: int
    user_id: int
    content: str = Field(..., min_length=1)

class ChatMessageResponse(BaseModel):
    chat_id: int
    pod_id: int
    user_id: int
    content: str
    time: datetime
    username: Optional[str] = None

    class Config:
        from_attributes = True