import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 60000, // 60초 (LLM 생성 시간 고려)
    withCredentials: false,
});

// 요청 시 localStorage에서 토큰을 꺼내서 Authorization 헤더에 자동 설정
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 오류 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // 401 에러 시 로그인 페이지로 리다이렉트
            localStorage.removeItem('access_token');
            localStorage.removeItem('is_authenticated');
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;