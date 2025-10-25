# app/controller/rag/rag_controller.py
from fastapi import APIRouter, Depends, HTTPException
from pymysql.connections import Connection
from app.database import get_db_connection
from app.repository.rag.rag_query_repository import RagQueryRepository
from app.service.rag.rag_service import RagService
from app.schemas.rag import RagSearchRequest, RagSearchResponse
from app.schemas.pod import PodResponse

router = APIRouter(prefix="/rag", tags=["RAG Search"])

_rag_service_instance = None

def get_rag_service(db: Connection = Depends(get_db_connection)) -> RagService:
    """RagService 싱글톤"""
    global _rag_service_instance
    if _rag_service_instance is None:
        rag_query_repo = RagQueryRepository(db)
        _rag_service_instance = RagService(rag_query_repo)
    
    _rag_service_instance.rag_query_repo = RagQueryRepository(db)
    return _rag_service_instance

@router.post("/search", response_model=RagSearchResponse)
async def search_pods_with_rag(
    request: RagSearchRequest,
    rag_service: RagService = Depends(get_rag_service)
):
    """
    RAG 기반 하이브리드 검색
    
    1. 키워드 분석
    2. 벡터 유사도 검색
    3. RDB 필터링
    4. LLM 답변 생성
    """
    try:
        retrieved_pods_data = rag_service.search(request.query)
        llm_answer = rag_service.generate_answer(request.query, retrieved_pods_data)
        
        retrieved_pods = [PodResponse(**pod) for pod in retrieved_pods_data]
        
        return RagSearchResponse(
            llm_answer=llm_answer,
            retrieved_pods=retrieved_pods,
            total_found=len(retrieved_pods)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG search failed: {str(e)}")

@router.get("/health", response_model=dict)
async def rag_health_check(rag_service: RagService = Depends(get_rag_service)):
    """RAG 시스템 상태 확인"""
    try:
        collection_count = rag_service.collection.count()
        
        return {
            "status": "healthy",
            "embedding_model": settings.EMBEDDING_MODEL_NAME,
            "llm_provider": settings.LLM_PROVIDER,
            "vector_db_count": collection_count,
            "vector_db_path": settings.CHROMA_DB_PATH
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"RAG system unhealthy: {str(e)}")