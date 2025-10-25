import time
class User:
    def __init__(self,username,phonenumber):
        self.username = username
        self.phonenumber = phonenumber
        self.createdAt = time.localtime()