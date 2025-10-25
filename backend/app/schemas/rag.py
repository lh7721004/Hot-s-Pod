# app/schemas/rag.py
from pydantic import BaseModel, Field
from typing import List
from app.schemas.pod import PodResponse

class RagSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    user_id: Optional[int] = None

class RagSearchResponse(BaseModel):
    llm_answer: str
    retrieved_pods: List[PodResponse]
    total_found: int