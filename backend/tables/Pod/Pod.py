import time
class Pod:
    def __init__(self,host_user_id,event_time,place,title,content):
        self.host_user_id = host_user_id
        self.event_time = event_time
        self.place = place
        self.title = title
        self.content = content
        self.created_at = time.localtime()
