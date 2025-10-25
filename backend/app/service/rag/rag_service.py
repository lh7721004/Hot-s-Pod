# app/service/rag/rag_service.py
import logging
import requests
import chromadb
from app.core.config import settings
from app.repository.rag.rag_query_repository import RagQueryRepository
from typing import List, Dict, Any
from models.embedding_model import embedding_instance

logger = logging.getLogger(__name__)
#드디어 제가 할줄아는게 나왔네요 너무 기뻐요 행복해요 즐거워요 신나요 짜릿해요 

class RagService: #친절한 주석 < -RAG서비스
    def __init__(self):
        logger.info("Initializing RagService...")
        self.embedding_model = embedding_instance
        self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
        self.collection = self.chroma_client.get_or_create_collection(
            name="hots_pod_collection",
            metadata={"hnsw:space": "cosine"}
        )
        logger.info("ChromaDB collection ready")

    def search(self, query: str, rag_query_repo: RagQueryRepository) -> List[Dict[str, Any]]: #이게 검색임
        logger.info(f"RAG Search: '{query}'")   
        all_categories = rag_query_repo.get_all_categories()  #대충뭔지 알겠죠? 다 가져오는겁니다     
        found_category_id = None
        for cat in all_categories:
            if cat['category_name'] in query:
                found_category_id = cat['category_id'] #이거까지는 규칙기반 매핑이에요. 왜? 금쪽이 사용자가 선택하니까!
                break       
        place_keyword = None
        for keyword in settings.PLACE_KEYWORDS: #이거 CONFIG에 있는 키워드 사전인데, 규칙기반 매핑하고 시작하면 진짜 개빨라서 채택함
            if keyword in query:
                place_keyword = keyword
                break
        #대충 석장 들어가면 다 같은단어로 본다거나, 신경주역, 경주역 이런거 굳이 유사도검색없이 키워드 서칭할수있게해줌
        query_vector = self.embedding_model.encode(query).tolist() #벡터화 입니당
        results = self.collection.query( #이때 이미 질문기준으로 뒤에 워커파일이 유사도높은걸 가져와서 이거만 하면됩니당
            query_embeddings=[query_vector],
            n_results=20 #이게 출력되는 개순데, 이전에는 3개했었는데. 프렌들리 AI쓰면되니까 일단 늘려둠
        )       
        if not results['ids'] or not results['ids'][0]:
            logger.warning("No vector search results") # 진짜 예외처리 안하는데 코파일럿이 이거보고 죽일라해서 넣음
            return []
            
        retrieved_pod_ids = [int(id_str) for id_str in results['ids'][0]] #벡터검색으로 찾은 pod 들인데 이제 RDB필터링을 해봅시다
        # RDB필터링이 뭐냐면 벡터검색은 그냥 유사도 높은거 찾는거라서, 사용자가 장소나 카테고리 조건을 넣었을때 그걸 반영못함
        # 그래서 RDB에서 다시 필터링하는 과정이 필요함
        logger.info(f"Found {len(retrieved_pod_ids)} candidates")
        final_pods = rag_query_repo.filter_pods(
            pod_ids=retrieved_pod_ids,
            place_keyword=place_keyword,
            category_id=found_category_id
        )
        #이렇게요
        logger.info(f"Final results: {len(final_pods)} pods") #최종결과 로그
        return final_pods

    def generate_answer(self, query: str, context_pods: List[Dict[str, Any]]) -> str: # LLM호출부입니다 뭐 여기서부턴 별거없어요
        """LLM을 사용하여 답변 생성"""
        if not context_pods:
            return "죄송합니다, 관련된 소모임을 찾을 수 없습니다." # 텍스트 이것들은 GPT한테 맡길께요.. 지금 쓰면 좋은말을 못할거같네요

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
            return self._generate_with_api(prompt)
        elif settings.LLM_PROVIDER == 'LOCAL':
            return self._generate_with_local_llm(query, context_str)
        else:
            return f"총 {len(context_pods)}개의 소모임을 찾았습니다."

    def _generate_with_api(self, prompt: str) -> str:
        """API 모드"""
        headers = {
            "Authorization": f"Bearer {settings.LLM_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": settings.LLM_MODEL_NAME,
            "messages": [{"role": "user", "content": prompt}], #여기서부터가 프롬포트, 하이퍼파라미터 조정단계
            "max_tokens": 300                       # API쓸거면 그냥 최소 300
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
            logger.error(f"LLM API failed: {e}")
            return "AI 답변 생성 중 오류가 발생했습니다."
            
    def _generate_with_local_llm(self, query: str, context_str: str) -> str:
        """로컬 LLM 모드"""
        try:
            from models.llm_model import get_llm_instance
            llm = get_llm_instance()
            
            messages = [
                {
                    "role": "system", 
                    "content": "당신은 Hot's POD의 친절한 AI 어시스턴트입니다. 소모임 정보를 바탕으로 자연스럽게 답변하세요."
                },
                {
                    "role": "user", 
                    "content": f"""다음은 검색된 소모임 정보입니다:

                    {context_str}

                    질문: {query}

                    위 정보를 바탕으로 답변해주세요."""
                }
            ]
            
            response = llm.generate_response(messages, max_new_tokens=256, do_sample=True) # 256 상당히 불안한데 해보고 늘리는걸로 가죠
            return response
 # LLM해보고 맘에안들면 파인튜닝할거라 일부러 파라미터 계산아직안함. 절대 귀찮아서 그런거 아님 절대 절대           
        except Exception as e:
            logger.error(f"Local LLM failed: {e}")
            return "로컬 LLM 답변 생성 중 오류가 발생했습니다."