# app/service/comment/comment_service.py
from app.repository.comment.comment_command_repository import CommentCommandRepository
from app.repository.comment.comment_query_repository import CommentQueryRepository
from app.schemas.comment import CommentCreateRequest, CommentResponse, CommentWithReplies
from typing import Optional, List

class CommentService:
    def __init__(self, command_repo: CommentCommandRepository, query_repo: CommentQueryRepository):
        self.command_repo = command_repo
        self.query_repo = query_repo
    
    def create_comment(self, request: CommentCreateRequest) -> int:
        """댓글 생성"""
        return self.command_repo.create_comment(request)
    
    def get_comment(self, comment_id: int) -> Optional[CommentResponse]:
        """댓글 조회"""
        comment_data = self.query_repo.find_comment_by_id(comment_id)
        if comment_data:
            return CommentResponse(**comment_data)
        return None
    
    def get_pod_comments(self, pod_id: int) -> List[CommentWithReplies]:
        """Pod의 댓글 계층 구조로 반환"""
        comments_data = self.query_repo.find_comments_by_pod(pod_id)
        
        # 댓글을 딕셔너리로 변환
        comments_dict = {c['comment_id']: CommentWithReplies(**c) for c in comments_data}
        
        # 계층 구조 생성
        root_comments = []
        for comment in comments_dict.values():
            if comment.parent_comment_id is None:
                root_comments.append(comment)
            else:
                parent = comments_dict.get(comment.parent_comment_id)
                if parent:
                    parent.replies.append(comment)
        
        return root_comments
    
    def delete_comment(self, comment_id: int) -> bool:
        """댓글 삭제"""
        return self.command_repo.delete_comment(comment_id)