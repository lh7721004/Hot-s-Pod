import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainUI from "./Main.presenter.jsx";
import AddPodContainer from "../../common/modals/AddPod/AddPodContainer.jsx";
import { useDispatch } from "react-redux";
import { createPod, fetchPods } from "@redux/slices/podSlice.js";
import { useMe } from "../../../queries/useMe.js";


export default function Main() {
    const categories = ["전체","스터디","취미,여가","운동"];
    const [selectedCategory,setSelectedCategory] = useState(0); 
    const [isPodModalOpen, setIsPodModalOpen] = useState(false);
    const { data, isLoading, isError } = useMe();
    const [open, setOpen] = useState(false);
    const [orderBy, setOrderBy] = useState("최신순");
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        if (data)
            console.log("[Main.container.jsx] me:", data);
    }, [data]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const handleChange = (event) => {
        console.log(event)
        setOrderBy(event.target.value);
    }

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
                // open={open} 
                // setOpen={setOpen}
                // handleClick={handleClick}
                // handleClose={handleClose}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                orderBy={orderBy}
                handleChange={handleChange}
                pods={pods}
                onOpenPodModal={handleOpenPodModal}
                // onViewAllPods={handleViewAllPods}
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