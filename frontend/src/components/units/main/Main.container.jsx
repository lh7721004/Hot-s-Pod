import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainUI from "./Main.presenter.jsx";
import AddPodContainer from "../../common/modals/AddPod/AddPodContainer.jsx";
import { useDispatch } from "react-redux";
import { createPod, fetchPods } from "@redux/slices/podSlice.js";

export default function Main() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPodModalOpen, setIsPodModalOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // 로그인 상태 확인
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('is_authenticated');
        setIsLoggedIn(false);
        window.location.reload();
    };

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

    const handleViewAllPods = () => {
        navigate('/pods');
    };

    const handlePodClick = (podId) => {
        navigate(`/chat/${podId}`);
    };

    let announcements = [
        {title: '공지1', content: '공지내용 1 공지내용 1 공지내용 1 공지내용 1공지내용  1 공지내용 1공지내용 1 공지내용 1  공지내용 1공지내용 1공지내용 1공지내용 1', date: '2024-01-12'},
        {title: '공지1', content: '공지내용 1', date: '2024-01-12'},
        {title: '공지1', content: '공지내용 1', date: '2024-01-12'},
        {title: '공지1', content: '공지내용 1', date: '2024-01-12'},
        {title: '공지1', content: '공지내용 1', date: '2024-01-12'},
        {title: '공지1', content: '공지내용 1', date: '2024-01-12'}
    ]

    let pods = [
        {title: 'POD 1', content: 'IT 개발 POD', date: '2025-01-12'},
        {title: 'POD 2', content: '음악 POD', date: '2025-01-12'},
        {title: 'POD 3', content: '봉사 POD', date: '2025-01-12'}
    ]

    return (
        <>
            <MainUI 
                announcements={announcements} 
                pods={pods}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                onOpenPodModal={handleOpenPodModal}
                onViewAllPods={handleViewAllPods}
                onPodClick={handlePodClick}
            />
            <AddPodContainer 
                isOpen={isPodModalOpen}
                onClose={handleClosePodModal}
                onSave={handleSavePod}
            />
        </>
    );
}