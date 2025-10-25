# app/service/rag/rag_worker_service.py
import asyncio
import logging
from sentence_transformers import SentenceTransformer
import chromadb
from app.core.config import settings
from app.database import DatabaseConnectionPool
from app.repository.rag.rag_command_repository import RagCommandRepository
from app.repository.rag.rag_query_repository import RagQueryRepository

logger = logging.getLogger(__name__)

class RagWorkerService:
    def __init__(self):
        logger.info("🔄 Initializing RAG Worker...")
        
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        logger.info(f"✅ Embedding model loaded")
        
        self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
        self.collection = self.chroma_client.get_or_create_collection(
            name="hots_pod_collection",
            metadata={"hnsw:space": "cosine"}
        )
        
        # ✅ DB 연결 제거 (매 루프마다 새로 생성)
        logger.info("✅ RAG Worker initialized")

    async def run_worker(self):
        logger.info("🚀 RAG Worker started")
        
        while True:
            db = None  # ✅ 초기화
            try:
                # ✅ 매 루프마다 새 DB 연결
                db = DatabaseConnectionPool.get_pool().connection()
                rag_command_repo = RagCommandRepository(db)
                rag_query_repo = RagQueryRepository(db)
                
                jobs = rag_command_repo.get_pending_jobs(limit=5)
                
                if jobs:
                    logger.info(f"📦 Found {len(jobs)} jobs")
                    for job in jobs:
                        await self.process_job(job, rag_command_repo, rag_query_repo)
                else:
                    await asyncio.sleep(2)
                
            except Exception as e:
                logger.error(f"❌ Worker error: {e}")
                await asyncio.sleep(5)
            finally:
                if db is not None:
                    db.close()

    async def process_job(self, job: dict, rag_command_repo: RagCommandRepository, rag_query_repo: RagQueryRepository):
        queue_id = job['queue_id']
        pod_id = job['pod_id']
        action_type = job['action_type']
        
        logger.info(f"⚙️ Processing job {queue_id}: {action_type} for pod_id {pod_id}")
        
        try:
            if action_type == 'upsert':
                await self._process_upsert(pod_id, rag_query_repo)
            elif action_type == 'delete':
                await self._process_delete(pod_id)
            
            rag_command_repo.delete_job(queue_id)
            logger.info(f"✅ Job {queue_id} completed")
            
        except Exception as e:
            logger.error(f"❌ Job {queue_id} failed: {e}")
            rag_command_repo.update_job_status(queue_id, 'failed')

    async def _process_upsert(self, pod_id: int, rag_query_repo: RagQueryRepository):
        pod_details = rag_query_repo.get_pod_details_for_vectorizing(pod_id)
        
        if not pod_details:
            raise ValueError(f"Pod {pod_id} not found")
        
        text_to_embed = (
            f"제목: {pod_details.get('title', '')}\n"
            f"내용: {pod_details.get('content', '')}\n"
            f"장소: {pod_details.get('place', '')}\n"
            f"카테고리: {pod_details.get('categories', '')}"
        )
        
        vector = self.embedding_model.encode(text_to_embed).tolist()
        
        self.collection.upsert(
            ids=[str(pod_id)],
            embeddings=[vector],
            metadatas=[{'pod_id': pod_id, 'title': pod_details.get('title', '')}],
            documents=[text_to_embed]
        )
        
        logger.info(f"✅ Vector upserted for pod_id {pod_id}")

    async def _process_delete(self, pod_id: int):
        try:
            self.collection.delete(ids=[str(pod_id)])
            logger.info(f"✅ Vector deleted for pod_id {pod_id}")
        except Exception as e:
            logger.warning(f"⚠️ Delete failed for pod_id {pod_id}: {e}")