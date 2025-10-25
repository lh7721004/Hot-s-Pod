# uvicorn main:app --reload
from fastapi import FastAPI
from controller.user import user_controller
from controller.oauth import oauth_controller
from controller.pod_member import pod_member_controller
from controller.comment import comment_controller
from controller.pod import pod_controller
import dotenv
import ddl.DDL
dotenv.load_dotenv()
app = FastAPI()
app.include_router(user_controller.controller)
app.include_router(oauth_controller.controller)
app.include_router(pod_member_controller.controller)
app.include_router(comment_controller.controller)
app.include_router(pod_controller.controller)