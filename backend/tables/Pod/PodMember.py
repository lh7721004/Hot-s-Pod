import time
class PodMember:
    def __init__(self,user_id,pod_id,amount,place_start,place_end):
        self.user_id = user_id
        self.pod_id = pod_id
        self.amount = amount
        self.place_start = place_start
        self.place_end = place_end
        self.joined_at = time.localtime()
