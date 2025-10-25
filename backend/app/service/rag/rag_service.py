# app/service/rag/rag_service.py
import logging
import requests
from sentence_transformers import SentenceTransformer
import chromadb
from app.core.config import settings
from app.repository.rag.rag_query_repository import RagQueryRepository
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class RagService:
    def __init__(self, rag_query_repo: Optional[RagQueryRepository] = None):
        logger.info("🔄 Initializing RagService...")
        self.rag_query_repo = rag_query_repo
        
        # ✅ Embedding 모델 - 싱글톤에서 한 번만 로딩
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        logger.info(f"✅ Embedding model loaded: {settings.EMBEDDING_MODEL_NAME}")
        
        # ✅ ChromaDB 클라이언트 - 싱글톤에서 한 번만 초기화
        self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
        self.collection = self.chroma_client.get_or_create_collection(
            name="hots_pod_collection",
            metadata={"hnsw:space": "cosine"}
        )
        logger.info("✅ ChromaDB collection ready")

    def search(self, query: str, rag_query_repo: Optional[RagQueryRepository] = None) -> List[Dict[str, Any]]:
        """
        RAG 검색 (repository를 외부에서 주입 가능)
        
        Args:
            query: 검색 쿼리
            rag_query_repo: 외부에서 주입할 repository (None이면 내부 repository 사용)
        """
        logger.info(f"🔍 RAG Search: '{query}'")
        
        # ✅ Repository 선택: 외부 주입 > 내부 repository
        repo = rag_query_repo if rag_query_repo is not None else self.rag_query_repo
        
        if repo is None:
            raise ValueError("RagQueryRepository is not available")
        
        all_categories = repo.get_all_categories()
        
        found_category_id = None
        for cat in all_categories:
            if cat['category_name'] in query:
                found_category_id = cat['category_id']
                break
        
        place_keyword = None
        for keyword in settings.PLACE_KEYWORDS:
            if keyword in query:
                place_keyword = keyword
                break

        query_vector = self.embedding_model.encode(query).tolist()
        results = self.collection.query(
            query_embeddings=[query_vector],
            n_results=20
        )
        
        if not results['ids'] or not results['ids'][0]:
            logger.warning("⚠️ No vector search results")
            return []
            
        retrieved_pod_ids = [int(id_str) for id_str in results['ids'][0]]
        logger.info(f"🎯 Found {len(retrieved_pod_ids)} candidates")

        final_pods = repo.filter_pods(
            pod_ids=retrieved_pod_ids,
            place_keyword=place_keyword,
            category_id=found_category_id
        )
        
        logger.info(f"✅ Final results: {len(final_pods)} pods")
        return final_pods

    def generate_answer(self, query: str, context_pods: List[Dict[str, Any]]) -> str:
        if not context_pods:
            return "죄송합니다, 관련된 소모임을 찾을 수 없습니다."

        context_str = "다음은 관련 소모임입니다:\n\n"
        for i, pod in enumerate(context_pods[:5], 1):
            context_str += f"[{i}번]\n"
            context_str += f"- 제목: {pod['title']}\n"
            context_str += f"- 장소: {pod['place']}\n"
            context_str += f"- 일시: {pod['event_time']}\n\n"
        
        prompt = f"""당신은 Hot's POD의 AI 어시스턴트입니다.
아래 정보를 바탕으로 질문에 답변하세요.

[정보]
{context_str}

[질문]
{query}

[답변]
"""

        if settings.LLM_PROVIDER == 'API':
            headers = {
                "Authorization": f"Bearer {settings.LLM_API_KEY}",
                "Content-Type": "application/json"
            }
            data = {
                "model": settings.LLM_MODEL_NAME,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 300
            }
            
            try:
                response = requests.post(
                    settings.LLM_API_URL,
                    headers=headers,
                    json=data,
                    timeout=30
                )
                response.raise_for_status()
                result = response.json()
                return result['choices'][0]['message']['content'].strip()
            except Exception as e:
                logger.error(f"❌ LLM API failed: {e}")
                return "AI 답변 생성 중 오류가 발생했습니다."
        
        return "LLM이 설정되지 않았습니다."