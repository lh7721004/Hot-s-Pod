import time
class Log:
    def __init__(self,user_id,log_code,content):
        self.user_id = user_id
        self.log_code = log_code
        self.time = time.localtime()
        self.content = content
