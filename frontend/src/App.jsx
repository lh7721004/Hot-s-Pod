import { Routes, Route } from "react-router-dom";
import Home from "../pages/main/index.jsx";
import OAuthCallback from "../pages/oauth/callback.jsx";
import PodsPage from "../pages/pods/index.jsx";
import ChatPage from "../pages/chat/index.jsx";
import LoginPage from "../pages/login/index.jsx";
import MyPage from "../pages/myPage/index.jsx";
import LayoutWrapper from "./components/common/layout/LayoutWrapper.jsx";
import RequireAuth from "./components/common/layout/auth/index.jsx";


export default function App() {
  return (
    <div className="flex min-h-screen">
      <Routes>
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/pods" element={
          <RequireAuth>
              <PodsPage />
          </RequireAuth>
        } />
        <Route path="/chat/:podId" element={
          <RequireAuth>
            <ChatPage />
          </RequireAuth>
        } />
      </Routes>
    </div>
  );
}

