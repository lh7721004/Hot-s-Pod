# Hot's POD - AI 기반 소모임 플랫폼

## 설치 방법

```bash
# 1. 가상 환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. 의존성 설치
pip install -r requirements.txt

# 3. .env 파일 설정
cp .env.example .env
# .env 파일을 열어 실제 값으로 수정

# 4. 데이터베이스 초기화
python init_db.py

# 5. 애플리케이션 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Repository scaffold for Hot-s-Pod. Contains backend app package skeleton and basic repo files.

Files added by scaffold:
- app/ (package skeleton)
- .env (example env file — do not commit secrets)
- .gitignore
- requirements.txt
- init_db.py


# Hot-s-Pod

hots-pod-project/backend/
├── .env
├── .gitignore
├── requirements.txt
├── init_db.py
├── README.md
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   └── auth.py
│   │
│   ├── ddl/
│   │   ├── __init__.py
│   │   └── DDL.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── pod.py
│   │   ├── oauth.py
│   │   └── rag.py
│   │
│   ├── repository/
│   │   ├── __init__.py
│   │   │
│   │   ├── user/
│   │   │   ├── __init__.py
│   │   │   ├── user_command_repository.py
│   │   │   └── user_query_repository.py
│   │   │
│   │   ├── pod/
│   │   │   ├── __init__.py
│   │   │   ├── pod_command_repository.py
│   │   │   └── pod_query_repository.py
│   │   │
│   │   ├── oauth/
│   │   │   ├── __init__.py
│   │   │   ├── oauth_command_repository.py
│   │   │   └── oauth_query_repository.py
│   │   │
│   │   └── rag/
│   │       ├── __init__.py
│   │       ├── rag_command_repository.py
│   │       └── rag_query_repository.py
│   │
│   ├── service/
│   │   ├── __init__.py
│   │   │
│   │   ├── user/
│   │   │   ├── __init__.py
│   │   │   └── user_service.py
│   │   │
│   │   ├── pod/
│   │   │   ├── __init__.py
│   │   │   └── pod_service.py
│   │   │
│   │   ├── oauth/
│   │   │   ├── __init__.py
│   │   │   └── oauth_service.py
│   │   │
│   │   └── rag/
│   │       ├── __init__.py
│   │       ├── rag_service.py
│   │       └── rag_worker_service.py
│   │
│   ├── controller/
│   │   ├── __init__.py
│   │   │
│   │   ├── user/
│   │   │   ├── __init__.py
│   │   │   └── user_controller.py
│   │   │
│   │   ├── pod/
│   │   │   ├── __init__.py
│   │   │   └── pod_controller.py
│   │   │
│   │   ├── oauth/
│   │   │   ├── __init__.py
│   │   │   └── oauth_controller.py
│   │   │
│   │   └── rag/
│   │       ├── __init__.py
│   │       └── rag_controller.py
│   │
│   └── socket/
│       ├── __init__.py
│       └── websocket.py
│
└── chroma_db_data/ (자동 생성됨)