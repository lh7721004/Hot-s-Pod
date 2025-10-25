# app/service/chat/chat_service.py
from app.repository.chat.chat_command_repository import ChatCommandRepository
from app.repository.chat.chat_query_repository import ChatQueryRepository
from app.schemas.chat import ChatMessageCreate, ChatMessageResponse
from typing import List, Optional

class ChatService:
    def __init__(self, command_repo: ChatCommandRepository, query_repo: ChatQueryRepository):
        self.command_repo = command_repo
        self.query_repo = query_repo
    
    def save_message(self, message_data: ChatMessageCreate) -> int:
        """채팅 메시지 저장"""
        return self.command_repo.create_message(message_data)
    
    def get_pod_messages(
        self, 
        pod_id: int, 
        limit: int = 100, 
        before_chat_id: Optional[int] = None
    ) -> List[ChatMessageResponse]:
        """Pod의 채팅 메시지 조회"""
        messages_data = self.query_repo.find_messages_by_pod(pod_id, limit, before_chat_id)
        return [ChatMessageResponse(**msg) for msg in messages_data]