# models/llm_model.py
import logging
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig
from app.core.config import settings

logger = logging.getLogger(__name__)

class LLMModel:
    def __init__(self):
        if settings.LLM_PROVIDER != "LOCAL":
            logger.info("LLM Provider is not LOCAL, skipping model load")
            self.llm = None
            self.tokenizer = None
            self.gen_config = None
            return       
        logger.info(f"Loading local LLM: {settings.LOCAL_LLM_MODEL_NAME}")        
        self.model_name = settings.LOCAL_LLM_MODEL_NAME
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
       
        load_kwargs = {
            "trust_remote_code": True
        }       
        if torch.cuda.is_available():
            load_kwargs["torch_dtype"] = torch.bfloat16
            load_kwargs["device_map"] = settings.LOCAL_LLM_DEVICE            
            if settings.LOCAL_LLM_LOAD_IN_8BIT:
                load_kwargs["load_in_8bit"] = True
        else:
            load_kwargs["torch_dtype"] = torch.float32
        
        self.llm = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            **load_kwargs
        )
        
        try:
            self.gen_config = GenerationConfig.from_pretrained(self.model_name)
        except:
            logger.warning("GenerationConfig not found, using defaults")
            self.gen_config = GenerationConfig(
                max_new_tokens=512, #최대응답토큰
                temperature=0.7, # 창의성지수, 높일수록 금쪽이가됨
                top_p=0.9, # 핵심단어 비율, 낮출수록 금쪽이가됨
                do_sample=True
            )
        
        logger.info("Local LLM loaded")
        logger.info(f"Device: {settings.LOCAL_LLM_DEVICE if torch.cuda.is_available() else 'CPU'}")
        logger.info(f"GPU available: {torch.cuda.is_available()}")
        logger.info(f"8bit quantization: {settings.LOCAL_LLM_LOAD_IN_8BIT and torch.cuda.is_available()}")
        #그냥 로딩정보, 기기정보 (GPU/CPU), 양자화여부 표시용
        #갑자기 생각난건데 양자화는 CPU에서는 동작안함
        #모델자체가 양자화가 아니라 트랜스포머에서 지원하는거라그럼
    def generate_response(self, messages, max_new_tokens, do_sample=True):
        if self.llm is None:
            raise RuntimeError("LLM model not loaded. Set LLM_PROVIDER=LOCAL")        
        input_ids = self.tokenizer.apply_chat_template(
            messages, 
            tokenize=True, 
            add_generation_prompt=True, 
            return_tensors="pt"
        ).to(self.llm.device)        
        output = self.llm.generate(
            input_ids, 
            generation_config=self.gen_config, 
            max_new_tokens=max_new_tokens, 
            do_sample=do_sample
        )       
        response = self.tokenizer.decode(
            output[0][input_ids.shape[-1]:], 
            skip_special_tokens=True
        )
        return response.strip()
    
llm_instance = None
def get_llm_instance():
    global llm_instance
    if llm_instance is None:
        llm_instance = LLMModel()
    return llm_instance