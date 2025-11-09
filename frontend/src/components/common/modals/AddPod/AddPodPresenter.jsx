import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Input, DatePicker, ConfigProvider, Button, Select } from "antd";
import locale from "antd/locale/ko_KR";

const { TextArea } = Input;

export default function AddPodPresenter({
                                                 isOpen,
                                                 onClose,
                                                 form,
                                                 handleChange,
                                                 handleEventDateChange,
                                                 handleCategoryChange,
                                                 handleSubmit,
                                                 hasErrors,
                                                 errors,
                                                 categories
                                             }) {
    const dialogHeight = hasErrors ? "750px" : "680px";

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            slotProps={{
                paper: { style: { width: "480px", height: dialogHeight, maxHeight: "90vh" } }
            }}
        >
            <DialogTitle className="flex justify-start pl-[50px] pt-10 text-black text-[23px] font-semibold">
                POD 생성
            </DialogTitle>

            <DialogContent className="p-6 flex flex-col justify-between h-full items-center overflow-y-auto">
                <div className="space-y-4 pt-3 w-full px-7">
                    {/* 제목 */}
                    <div className="flex flex-col space-y-1">
                        <div className="flex flex-row items-center space-x-2 w-full">
                            <label className="text-black text-[16px] font-medium w-[80px]">제목</label>
                            <Input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="POD 제목을 입력하세요"
                                status={errors.title ? "error" : ""}
                                className="h-[45px] text-[16px] flex-1"
                            />
                        </div>
                        {errors.title && <p className="text-red-500 text-sm mt-1 ml-[90px]">{errors.title}</p>}
                    </div>

                    {/* 설명 */}
                    <div className="flex flex-col space-y-1">
                        <div className="flex flex-row items-start space-x-2 w-full">
                            <label className="text-black text-[16px] font-medium w-[80px] pt-2">설명</label>
                            <TextArea
                                name="content"
                                value={form.content}
                                onChange={handleChange}
                                placeholder="POD 설명을 입력하세요"
                                status={errors.content ? "error" : ""}
                                className="text-[16px] flex-1"
                                rows={3}
                            />
                        </div>
                        {errors.content && <p className="text-red-500 text-sm mt-1 ml-[90px]">{errors.content}</p>}
                    </div>

                    {/* 장소 */}
                    <div className="flex flex-col space-y-1">
                        <div className="flex flex-row items-center space-x-2 w-full">
                            <label className="text-black text-[16px] font-medium w-[80px]">장소</label>
                            <Input
                                name="place"
                                value={form.place}
                                onChange={handleChange}
                                placeholder="모임 장소를 입력하세요"
                                status={errors.place ? "error" : ""}
                                className="h-[45px] text-[16px] flex-1"
                            />
                        </div>
                        {errors.place && <p className="text-red-500 text-sm mt-1 ml-[90px]">{errors.place}</p>}
                    </div>

                    {/* 이벤트 일시 */}
                    <div className="flex flex-col space-y-1">
                        <div className="flex flex-row items-center space-x-2 w-full">
                            <label className="text-black text-[16px] font-medium w-[80px]">이벤트 일시</label>
                            <ConfigProvider locale={locale}>
                                <DatePicker
                                    value={form.event_time}
                                    onChange={handleEventDateChange}
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder="이벤트 일시 선택"
                                    status={errors.event_time ? "error" : ""}
                                    className="h-[45px] flex-1"
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                />
                            </ConfigProvider>
                        </div>
                        {errors.event_time && <p className="text-red-500 text-sm mt-1 ml-[90px]">{errors.event_time}</p>}
                    </div>

                    {/* 카테고리 */}
                    <div className="flex flex-col space-y-1">
                        <div className="flex flex-row items-center space-x-2 w-full">
                            <label className="text-black text-[16px] font-medium w-[80px]">카테고리</label>
                            <Select
                                mode="multiple"
                                value={form.category_ids}
                                onChange={handleCategoryChange}
                                placeholder="카테고리를 선택하세요"
                                status={errors.category_ids ? "error" : ""}
                                className="flex-1"
                                options={categories}
                            />
                        </div>
                        {errors.category_ids && <p className="text-red-500 text-sm mt-1 ml-[90px]">{errors.category_ids}</p>}
                    </div>
                </div>

                <Button
                    type="primary"
                    size="large"
                    className="w-[120px] bg-[#4368BA] text-white text-[16px] font-bold rounded-lg mb-6"
                    onClick={handleSubmit}
                >
                    추가
                </Button>
            </DialogContent>
        </Dialog>
    );
}