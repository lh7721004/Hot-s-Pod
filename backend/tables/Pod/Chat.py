import time
class Chat:
    def __init__(self,pod_id,user_id,content):
        self.pod_id = pod_id
        self.user_id = user_id
        self.content = content
        self.time = time.localtime()
