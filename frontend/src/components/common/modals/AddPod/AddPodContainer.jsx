import { useState } from "react";
import AddPodPresenter from "./AddPodPresenter";
import dayjs from "dayjs";

export default function AddPodContainer({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState({
        categories: [],
        podTitle: "",
        minPeople: 0,
        maxPeople: 100,
        openDate: null,
        openTime: null,
        selectedPlace: null,
    });

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCategories = (event) => {
        setForm({...form, categories: event.target.value.split(" ")})
    }

    const handleDateChange = (date) => {
        setForm({ ...form, openDate: date });
    };
    const handleTimeChange = (time) => {
        setForm({ ...form, openTime: time });
    }

    const handlePlaceChange = (data) => {
        setForm({ ...form, selectedPlace: data });
    }
    const handleAddressChange = (data) => {
        if(typeof data !=="SyntheticBaseEvent")
            setForm({...form, selectedPlace: {...form.selectedPlace, address:data.target.value}});
        else
            setForm({...form, selectedPlace: {...form.selectedPlace, address:data}});
    }

    const validateForm = () => {
        let newErrors = {};
        if (!form.podTitle.trim()) newErrors.podTitle = "제목을 입력하세요.";
        if (!form.openDate) newErrors.openDate = "모임날짜를 선택하세요.";
        if (!form.openTime) newErrors.openTime = "모임시간을 선택하세요.";
        if (!form.selectedPlace) newErrors.selectedPlace = "장소를 선택하세요.";
        setErrors(newErrors);
        setHasErrors(Object.keys(newErrors).length > 0);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        onSave({ ...form, openDate: form.openDate ? form.openDate.format("YYYY-MM-DD") : "", openTime: form.openTime ? form.openTime.format("HH:mm:SS") : "" });
        onClose();
        setHasErrors(false);
    };

    return (
        <AddPodPresenter
            isOpen={isOpen}
            onClose={onClose}
            form={form}
            handleChange={handleChange}
            handleCategories={handleCategories}
            handleDateChange={handleDateChange}
            handleTimeChange={handleTimeChange}
            handlePlaceChange={handlePlaceChange}
            handleAddressChange={handleAddressChange}
            handleSubmit={handleSubmit}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
            isTimePickerOpen={isTimePickerOpen}
            setIsTimePickerOpen={setIsTimePickerOpen}
            hasErrors={hasErrors}
            errors={errors}
        />
    );
}