import SideBarLayout from "./components/common/layout/sidebar";
import HeaderLayout from "./components/common/layout/header";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/main/index.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen">
    {/* <div className="flex min-h-screen bg-gradient-to-b from-[#4A96EC] via-[#4A96EC] to-[#237BE6]"> */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}
