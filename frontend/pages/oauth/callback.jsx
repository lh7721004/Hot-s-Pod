import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@redux/slices/userSlice";

export default function OAuthCallback() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // URL에서 토큰 추출
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('access_token');
        const userName = urlParams.get('user_name') || '사용자';

        if (token) {
            // 로컬스토리지에 토큰 저장
            localStorage.setItem('access_token', token);
            localStorage.setItem('is_authenticated', 'true');
            
            // Redux에 사용자 정보 저장
            dispatch(setUser({ userName }));
            
            // 메인 페이지로 리다이렉트
            setTimeout(() => {
                navigate('/');
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
