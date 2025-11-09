import { useState } from "react";
import AddPodPresenter from "./AddPodPresenter";
import dayjs from "dayjs";

export default function AddPodContainer({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState({
        podTitle: "",
        minPeople: 0,
        maxPeople: 100,
        openDate: null,
        expireDate: null,
        owner: "",
    });

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setForm({ ...form, openDate: date });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!form.podTitle.trim()) newErrors.podTitle = "제목을 입력하세요.";
        if (!form.openDate) newErrors.openDate = "개설일을 선택하세요.";
        if (!form.expireDate) newErrors.expireDate = "마감일을 선택하세요.";

        setErrors(newErrors);
        setHasErrors(Object.keys(newErrors).length > 0);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        onSave({ ...form, openDate: form.openDate ? form.openDate.format("YYYY-MM-DD") : "", expireDate: form.expireDate ? form.expireDate.format("YYYY-MM-DD") : "" });
        onClose();
        setHasErrors(false);
    };

    return (
        <AddPodPresenter
            isOpen={isOpen}
            onClose={onClose}
            form={form}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
            handleSubmit={handleSubmit}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
            hasErrors={hasErrors}
            errors={errors}
        />
    );
}