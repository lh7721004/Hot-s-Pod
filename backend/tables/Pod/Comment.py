import time
class Comment:
    def __init__(self,pod_id,user_id,content,parent_comment_id):
        self.pod_id = pod_id
        self.user_id = user_id
        self.content = content
        self.parent_comment_id = parent_comment_id
        self.created_at = time.localtime()
