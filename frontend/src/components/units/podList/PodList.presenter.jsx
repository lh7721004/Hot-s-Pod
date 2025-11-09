import ConditionBar from "../../common/layout/conditions/conditionbar";
import { Input, Button } from "antd";
import { useState } from "react";

export default function PodListPresenter({ pods, loading, onOpenPodModal, onChatClick, onBackClick, filters, onFilterChange, onSearch, onRagSearch }) {
    const [ragQuery, setRagQuery] = useState("");
    const [ragResults, setRagResults] = useState([]);
    const [ragLoading, setRagLoading] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    const handleRagSearch = async () => {
        if (!ragQuery.trim()) {
            alert("검색어를 입력하세요");
            return;
        }
        
        setRagLoading(true);
        try {
            const results = await onRagSearch(ragQuery);
            setRagResults(results || []);
        } catch (error) {
            console.error("RAG 검색 실패:", error);
            alert("검색에 실패했습니다");
        } finally {
            setRagLoading(false);
        }
    };

    // 필터 설정
    const filterLabels = {
        podTitle: "POD 제목",
    };

    const filterOrderKeys = ["podTitle"];

    const filterOptions = {};

    const filterTypes = {
        podTitle: "text",
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#F6F7F8] p-8">
            <div className="flex flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">전체 POD 목록</h1>
                <div className="flex gap-2">
                    <button 
                        onClick={onOpenPodModal}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        POD 생성
                    </button>
                    <button 
                        onClick={onBackClick}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        홈으로
                    </button>
                </div>
            </div>

            {/* RAG 검색 영역 */}
            <div className="mb-6 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">🔍 AI 검색 (RAG)</h2>
                <div className="flex gap-2">
                    <Input
                        value={ragQuery}
                        onChange={(e) => setRagQuery(e.target.value)}
                        placeholder="POD 내용을 자연어로 검색하세요 (예: 스터디 모임 찾아줘)"
                        onPressEnter={handleRagSearch}
                        size="large"
                        className="flex-1"
                    />
                    <Button
                        onClick={handleRagSearch}
                        loading={ragLoading}
                        type="primary"
                        size="large"
                        className="bg-blue-500"
                    >
                        검색
                    </Button>
                </div>
                
                {ragResults.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-bold mb-2">검색 결과:</h3>
                        <div className="space-y-2">
                            {ragResults.map((result, idx) => (
                                <div key={idx} className="p-3 bg-gray-50 rounded border">
                                    <div className="text-sm text-gray-600">{result}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 필터 영역 */}
            <div className="mb-6">
                <ConditionBar
                    title="POD 검색 및 필터"
                    conditions={filters}
                    setConditions={(newFilters) => {
                        Object.entries(newFilters).forEach(([key, value]) => {
                            onFilterChange(key, value);
                        });
                    }}
                    handleSearch={onSearch}
                    labels={filterLabels}
                    orderKeys={filterOrderKeys}
                    options={filterOptions}
                    types={filterTypes}
                />
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">설명</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">장소</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이벤트일</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">호스트</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">채팅</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pods.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    등록된 POD가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            pods.map((pod, index) => (
                                <tr key={pod.pod_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pod.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {pod.content || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {pod.place || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {pod.event_time ? new Date(pod.event_time).toLocaleString('ko-KR') : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {pod.host_username || `User #${pod.host_user_id}`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button 
                                            onClick={() => onChatClick(pod.pod_id)}
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                        >
                                            채팅
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}