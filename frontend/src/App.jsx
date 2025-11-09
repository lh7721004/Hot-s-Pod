import { Routes, Route } from "react-router-dom";
import Home from "../pages/main/index.jsx";
import OAuthCallback from "../pages/oauth/callback.jsx";
import PodsPage from "../pages/pods/index.jsx";
import ChatPage from "../pages/chat/index.jsx";
import LayoutWrapper from "./components/common/layout/LayoutWrapper.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/pods" element={
          <LayoutWrapper showSidebar={true}>
            <PodsPage />
          </LayoutWrapper>
        } />
        <Route path="/chat/:podId" element={
          <LayoutWrapper showSidebar={true}>
            <ChatPage />
          </LayoutWrapper>
        } />
      </Routes>
    </div>
  );
}

