import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@redux/slices/userSlice";

export default function OAuthCallback() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // URL에서 토큰 추출 (백엔드가 보내는 파라미터 이름: token, is_new_user)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token'); // 'access_token'이 아니라 'token'
        const isNewUser = urlParams.get('is_new_user');

        if (token) {
            // 로컬스토리지에 토큰 저장
            localStorage.setItem('access_token', token);
            localStorage.setItem('is_authenticated', 'true');
            
            // Redux에 사용자 정보 저장 (임시로 '사용자'로 설정)
            dispatch(setUser({ userName: '사용자' }));
            
            // 신규 유저면 프로필 설정 페이지로, 아니면 POD 목록으로
            setTimeout(() => {
                if (isNewUser === 'true') {
                    navigate('/profile/setup'); // 프로필 설정 페이지 (아직 없으면 /pods로)
                } else {
                    navigate('/pods');
                }
            }, 500);
        } else {
            alert('로그인에 실패했습니다.');
            navigate('/');
        }
    }, [navigate, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="text-xl font-bold mb-4">로그인 처리 중...</div>
                <div className="text-gray-500">잠시만 기다려주세요.</div>
            </div>
        </div>
    );
}
