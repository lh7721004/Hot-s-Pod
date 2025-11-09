import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPods, createPod } from "@redux/slices/podSlice";
import PodListPresenter from "./PodList.presenter";
import AddPodContainer from "../../common/modals/AddPod/AddPodContainer";
import axiosInstance from "@/api/axiosInstance";

export default function PodListContainer() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pods, loading } = useSelector((state) => state.pods);
    const [isPodModalOpen, setIsPodModalOpen] = useState(false);
    
    // 필터 상태
    const [filters, setFilters] = useState({
        podTitle: "",
    });

    useEffect(() => {
        dispatch(fetchPods());
    }, [dispatch]);

    const handleOpenPodModal = () => {
        setIsPodModalOpen(true);
    };

    const handleClosePodModal = () => {
        setIsPodModalOpen(false);
    };

    const handleSavePod = async (podData) => {
        try {
            await dispatch(createPod(podData)).unwrap();
            alert('POD가 생성되었습니다!');
            dispatch(fetchPods());
        } catch (error) {
            alert('POD 생성에 실패했습니다: ' + error.message);
        }
    };

    const handleChatClick = (podId) => {
        navigate(`/chat/${podId}`);
    };

    const handleBackClick = () => {
        navigate('/');
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        // 필터 적용하여 재조회
        dispatch(fetchPods());
    };

    const handleRagSearch = async (query) => {
        try {
            const response = await axiosInstance.post('/rag/search', {
                query: query
            });
            
            if (response.data) {
                return {
                    llm_answer: response.data.llm_answer,
                    retrieved_pods: response.data.retrieved_pods,
                    total_found: response.data.total_found
                };
            }
            return null;
        } catch (error) {
            console.error("RAG 검색 오류:", error);
            console.error("에러 상세:", error.response?.data);
            console.error("에러 상태:", error.response?.status);
            console.error("요청 URL:", error.config?.url);
            throw error;
        }
    };

    // 필터링된 POD 목록
    const filteredPods = pods.filter(pod => {
        const titleMatch = !filters.podTitle || pod.title?.includes(filters.podTitle);
        return titleMatch;
    });

    return (
        <>
            <PodListPresenter
                pods={filteredPods}
                loading={loading}
                onOpenPodModal={handleOpenPodModal}
                onChatClick={handleChatClick}
                onBackClick={handleBackClick}
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onRagSearch={handleRagSearch}
            />
            <AddPodContainer 
                isOpen={isPodModalOpen}
                onClose={handleClosePodModal}
                onSave={handleSavePod}
            />
        </>
    );
}
