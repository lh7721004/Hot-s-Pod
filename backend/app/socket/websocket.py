# app/socket/websocket.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json
import logging
from app.database import DatabaseConnectionPool
from app.repository.chat.chat_command_repository import ChatCommandRepository
from app.schemas.chat import ChatMessageCreate

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ws", tags=["WebSocket"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, pod_id: str):
        await websocket.accept()
        
        if pod_id not in self.active_connections:
            self.active_connections[pod_id] = []
        
        self.active_connections[pod_id].append(websocket)
        logger.info(f"✅ Client connected to pod {pod_id}")
    
    def disconnect(self, websocket: WebSocket, pod_id: str):
        if pod_id in self.active_connections:
            try:
                self.active_connections[pod_id].remove(websocket)
                logger.info(f"❌ Client disconnected from pod {pod_id}")
                
                if not self.active_connections[pod_id]:
                    del self.active_connections[pod_id]
            except ValueError:
                pass
    
    async def broadcast(self, message: dict, pod_id: str, exclude: WebSocket = None):
        if pod_id in self.active_connections:
            disconnected = []
            
            for connection in self.active_connections[pod_id]:
                if connection != exclude:
                    try:
                        await connection.send_json(message)
                    except Exception as e:
                        logger.error(f"Failed to send message: {e}")
                        disconnected.append(connection)
            
            for conn in disconnected:
                self.disconnect(conn, pod_id)

manager = ConnectionManager()

@router.websocket("/chat/{pod_id}")
async def websocket_chat_endpoint(websocket: WebSocket, pod_id: str):
    """
    실시간 채팅 WebSocket + DB 저장
    """
    await manager.connect(websocket, pod_id)
    
    # DB 연결
    db = DatabaseConnectionPool.get_pool().connection()
    chat_repo = ChatCommandRepository(db)
    
    try:
        while True:
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
                message['pod_id'] = pod_id
                
                # ✅ DB에 저장
                try:
                    chat_message = ChatMessageCreate(
                        pod_id=int(pod_id),
                        user_id=message['user_id'],
                        content=message['content']
                    )
                    chat_id = chat_repo.create_message(chat_message)
                    message['chat_id'] = chat_id
                    logger.info(f"💾 Message saved: chat_id={chat_id}")
                except Exception as e:
                    logger.error(f"Failed to save message: {e}")
                
                # 다른 클라이언트들에게 브로드캐스트
                await manager.broadcast(message, pod_id, exclude=websocket)
                
            except json.JSONDecodeError:
                await websocket.send_json({"error": "Invalid JSON format"})
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, pod_id)
        db.close()
        
        await manager.broadcast({
            "type": "system",
            "content": "A user has left the chat",
            "pod_id": pod_id
        }, pod_id)