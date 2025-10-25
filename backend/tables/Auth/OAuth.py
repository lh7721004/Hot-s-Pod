class OAuth:
    def __init__(self,k_id,user_id,username,access_token,refresh_token,profile_picture):
        self.k_id = k_id
        self.user_id = user_id
        self.username = username
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.profile_picture = profile_picture
        
        self.args = [self.k_id,self.user_id,self.username,self.access_token,self.refresh_token,self.profile_picture]