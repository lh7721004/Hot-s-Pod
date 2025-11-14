// frontend/src/pages/chat/index.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatMessages, sendChatMessage } from "@redux/slices/chatSlice";
import { useMe } from "../../src/queries/useMe"; // 로그인 사용자 정보 (쿠키 기반)

export default function ChatPage() {
  const { podId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 로그인 사용자
  const { data: me, isLoading: meLoading, isError: meError } = useMe();

  // Redux: 기존 메시지/로딩
  const { messages, loading } = useSelector((state) => state.chat);

  // 로컬 상태
  const [messageText, setMessageText] = useState("");
  const [wsMessages, setWsMessages] = useState([]);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // 스크롤 최하단
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, wsMessages]);

  // WebSocket URL (http→ws, https→wss)
  const wsUrl = useMemo(() => {
    if (!podId) return null;
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    // 백엔드 호스트가 프론트와 다른 경우 직접 지정 가능:
    // const host = "localhost:8000";
    const host = window.location.hostname + (window.location.port ? `:${window.location.port}` : "");
    // 만약 백엔드가 8000 포트라면 아래 한 줄로 호스트를 고정하세요:
    // const host = "localhost:8000";
    return `${proto}://${host.replace(/:\d+$/, "")}:8000/ws/chat/${podId}`;
  }, [podId]);

  // 초기 로드 + WS 연결
  useEffect(() => {
    if (!podId) return;

    // 1) REST로 기존 메시지 로드 (Axios withCredentials로 쿠키 자동전송 가정)
    dispatch(fetchChatMessages(podId));

    // 2) WebSocket 연결
    if (!wsUrl) return;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket Connected:", wsUrl);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // 백엔드 형식에 맞춰 정규화
        const normalized = {
          ...data,
          content: data.content ?? data.message,
          time: data.time ?? data.timestamp ?? Date.now(),
        };
        setWsMessages((prev) => [...prev, normalized]);
      } catch (e) {
        console.error("WS message parse error:", e);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      try {
        ws.current?.close();
      } catch {}
    };
  }, [podId, dispatch, wsUrl]);

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      // 1) WebSocket 우선
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            content: messageText,
            user_id: me?.user_id ?? 0, // 로그인 유저 ID
          })
        );
      } else {
        // 2) WS가 닫혀 있으면 REST fallback
        await dispatch(
          sendChatMessage({
            pod_id: parseInt(podId, 10),
            message: messageText,
          })
        ).unwrap();
      }
      setMessageText("");
    } catch (error) {
      alert("메시지 전송 실패: " + (error?.message || "unknown error"));
    }
  };

  // Enter 전송
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const allMessages = [...messages, ...wsMessages];

  // 로그인 체크 (라우트 가드가 이미 있다면 생략 가능)
  if (meLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  if (meError) {
    // 인증 실패 시 로그인 페이지로
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 w-full">
      {/* 헤더 */}
      <div className="flex flex-row justify-between items-center p-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold">POD 채팅방 #{podId}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">안녕하세요, {me?.username ?? me?.nickname ?? "사용자"}님</span>
          <button
            onClick={() => navigate("/pods")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            목록으로
          </button>
        </div>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {allMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">첫 메시지를 보내보세요!</div>
        ) : (
          allMessages.map((msg, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="bg-white rounded-lg p-3 shadow-sm max-w-md">
                <div className="text-xs text-gray-500 mb-1">
                  User #{msg.user_id ?? "-"} ·{" "}
                  {msg.time
                    ? new Date(msg.time).toLocaleString("ko-KR")
                    : msg.timestamp
                    ? new Date(msg.timestamp).toLocaleString("ko-KR")
                    : "방금"}
                </div>
                <div className="text-sm whitespace-pre-wrap break-words">
                  {msg.content ?? msg.message}
                </div>
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
            onKeyDown={handleKeyDown}
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
