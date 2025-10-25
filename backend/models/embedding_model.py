# models/embedding_model.py
import logging
from sentence_transformers import SentenceTransformer
from app.core.config import settings

logger = logging.getLogger(__name__)

class EmbeddingModel:
    def __init__(self):
        logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL_NAME}")
        self.embedder = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        logger.info("Embedding model loaded")
    
    def encode(self, texts, convert_to_tensor=False, convert_to_numpy=True, show_progress_bar=False):
        """텍스트를 벡터로 인코딩"""
        return self.embedder.encode(
            texts, 
            convert_to_tensor=convert_to_tensor,
            convert_to_numpy=convert_to_numpy, 
            show_progress_bar=show_progress_bar
        )

# 전역 인스턴스
embedding_instance = EmbeddingModel()