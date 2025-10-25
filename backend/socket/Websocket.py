from fastapi import APIRouter,HTTPException,Depends,WebSocket,Annotated,WebSocketException,Cookie,Query
from pymysql import Connection
from database import get_db
from service.chat.chat_service import ChatService
from typing import Annotated

from fastapi import (
    Cookie,
    Depends,
    Query,
    WebSocket,
    WebSocketException,
    status,
)
from fastapi.responses import RedirectResponse, JSONResponse
controller = APIRouter(prefix='/')
@controller.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
async def get_cookie_or_token(
    websocket: WebSocket,
    session: Annotated[str | None, Cookie()] = None,
    token: Annotated[str | None, Query()] = None,
):
    if session is None and token is None:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
    return session or token


@controller.websocket("/items/{item_id}/ws")
async def websocket_endpoint(*,websocket: WebSocket,item_id: str,q: int | None = None,cookie_or_token: Annotated[str, Depends(get_cookie_or_token)],):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(
            f"Session cookie or query token value is: {cookie_or_token}"
        )
        if q is not None:
            await websocket.send_text(f"Query parameter q is: {q}")
        await websocket.send_text(f"Message text was: {data}, for item ID: {item_id}")