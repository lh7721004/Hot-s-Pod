import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatMessages, sendChatMessage } from "@redux/slices/chatSlice";

export default function ChatPage() {
    const { podId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { messages, loading } = useSelector((state) => state.chat);
    const [messageText, setMessageText] = useState("");
    const [wsMessages, setWsMessages] = useState([]);
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, wsMessages]);

    useEffect(() => {
        if (podId) {
            // REST API로 기존 메시지 로드
            dispatch(fetchChatMessages(podId));

            // WebSocket 연결
            const token = localStorage.getItem('access_token');
            ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${podId}`);

            ws.current.onopen = () => {
                console.log('WebSocket Connected');
            };

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                // 백엔드 형식에 맞춰 정규화
                const normalizedData = {
                    ...data,
                    content: data.content || data.message,
                    time: data.time || data.timestamp
                };
                setWsMessages(prev => [...prev, normalizedData]);
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            ws.current.onclose = () => {
                console.log('WebSocket Disconnected');
            };

            return () => {
                if (ws.current) {
                    ws.current.close();
                }
            };
        }
    }, [podId, dispatch]);

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;

        try {
            // WebSocket으로 전송
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({
                    content: messageText,  // message → content로 변경
                    user_id: 1 // TODO: 실제 user_id 가져오기
                }));
            } else {
                // WebSocket 연결 안되어있으면 REST API 사용
                await dispatch(sendChatMessage({
                    pod_id: parseInt(podId),
                    message: messageText
                })).unwrap();
            }
            setMessageText("");
        } catch (error) {
            alert("메시지 전송 실패: " + error.message);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const allMessages = [...messages, ...wsMessages];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* 헤더 */}
            <div className="flex flex-row justify-between items-center p-4 bg-white shadow-sm">
                <h1 className="text-xl font-bold">POD 채팅방 #{podId}</h1>
                <button 
                    onClick={() => navigate('/pods')}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                    목록으로
                </button>
            </div>

            {/* 채팅 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {allMessages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        첫 메시지를 보내보세요!
                    </div>
                ) : (
                    allMessages.map((msg, idx) => (
                        <div key={idx} className="flex flex-col">
                            <div className="bg-white rounded-lg p-3 shadow-sm max-w-md">
                                <div className="text-xs text-gray-500 mb-1">
                                    User #{msg.user_id} · {msg.time ? new Date(msg.time).toLocaleString('ko-KR') : (msg.timestamp ? new Date(msg.timestamp).toLocaleString('ko-KR') : '방금')}
                                </div>
                                <div className="text-sm">{msg.content || msg.message}</div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className="bg-white p-4 shadow-lg">
                <div className="flex flex-row gap-2">
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        전송
                    </button>
                </div>
            </div>
        </div>
    );
}
