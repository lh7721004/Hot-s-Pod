import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AddPodPresenter from "./AddPodPresenter";
import dayjs from "dayjs";

export default function AddPodContainer({ isOpen, onClose, onSave }) {
    const user = useSelector((state) => state.user.user);
    
    const [form, setForm] = useState({
        title: "",
        content: "",
        place: "",
        event_time: null,
        category_ids: [],
        host_user_id: user?.user_id || 1,
    });

    const [errors, setErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(false);

    // 카테고리 옵션 (임시 - 나중에 API에서 가져올 수 있음)
    const categories = [
        { label: "스터디", value: 1 },
        { label: "운동", value: 2 },
        { label: "게임", value: 3 },
        { label: "여행", value: 4 },
        { label: "맛집", value: 5 },
    ];

    useEffect(() => {
        if (user?.user_id) {
            setForm(prev => ({ ...prev, host_user_id: user.user_id }));
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEventDateChange = (date) => {
        setForm({ ...form, event_time: date });
    };

    const handleCategoryChange = (values) => {
        setForm({ ...form, category_ids: values });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!form.title.trim()) newErrors.title = "제목을 입력하세요.";
        if (!form.place.trim()) newErrors.place = "장소를 입력하세요.";
        if (!form.event_time) newErrors.event_time = "이벤트 일시를 선택하세요.";
        if (form.category_ids.length === 0) newErrors.category_ids = "최소 1개의 카테고리를 선택하세요.";

        setErrors(newErrors);
        setHasErrors(Object.keys(newErrors).length > 0);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const podData = {
            ...form,
            event_time: form.event_time ? form.event_time.format("YYYY-MM-DD HH:mm:ss") : "",
        };

        onSave(podData);
        onClose();
        setHasErrors(false);
        
        // 폼 초기화
        setForm({
            title: "",
            content: "",
            place: "",
            event_time: null,
            category_ids: [],
            host_user_id: user?.user_id || 1,
        });
    };

    return (
        <AddPodPresenter
            isOpen={isOpen}
            onClose={onClose}
            form={form}
            handleChange={handleChange}
            handleEventDateChange={handleEventDateChange}
            handleCategoryChange={handleCategoryChange}
            handleSubmit={handleSubmit}
            hasErrors={hasErrors}
            errors={errors}
            categories={categories}
        />
    );
}