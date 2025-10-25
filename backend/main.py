import threading
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# 모든 컨트롤러 import
from app.controller.user import user_controller
from app.controller.pod import pod_controller
from app.controller.oauth import oauth_controller
from app.controller.rag import rag_controller
from app.controller.comment import comment_controller
from app.controller.chat import chat_controller  
from app.controller.pod_member import pod_member_controller
from app.socket import websocket
from app.service.rag.rag_worker_service import RagWorkerService

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

rag_worker = None
worker_thread = None

def run_rag_worker_in_thread():
    global rag_worker
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        rag_worker = RagWorkerService()
        loop.run_until_complete(rag_worker.run_worker())
    except asyncio.CancelledError:
        logger.info("🛑 RAG worker cancelled")
    except Exception as e:
        logger.error(f"❌ RAG worker error: {e}", exc_info=True)
    finally:
        loop.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    global worker_thread
    logger.info("🚀 Application starting up...")
    
    worker_thread = threading.Thread(target=run_rag_worker_in_thread, daemon=True)
    worker_thread.start()
    logger.info("✅ RAG worker thread started")
    
    yield
    
    logger.info("🛑 Application shutting down...")

app = FastAPI(
    title="Hot's POD API",
    description="AI 기반 오프라인 소모임 플랫폼 백엔드",
    version="3.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 모든 라우터 등록
app.include_router(user_controller.router)
app.include_router(pod_controller.router)
app.include_router(oauth_controller.router)
app.include_router(rag_controller.router)
app.include_router(comment_controller.router)  
app.include_router(chat_controller.router)       
app.include_router(pod_member_controller.router) 
app.include_router(websocket.router)

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Hot's POD API",
        "version": "3.0.0",
        "docs": "/docs",
        "oauth_login": "/oauth/kakao/login",
        "health": "/health"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "rag_worker": "running" if worker_thread and worker_thread.is_alive() else "stopped"
    }