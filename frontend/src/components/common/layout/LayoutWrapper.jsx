import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SideBarLayout from "./sidebar";
import HeaderLayout from "./header";

export default function LayoutWrapper({ children, showSidebar = false }) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const loggedIn = !!token;
        setIsLoggedIn(loggedIn);
        
        if (!loggedIn) {
            navigate('/');
        }
    }, [navigate]);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="flex min-h-screen">
            {showSidebar && <SideBarLayout />}
            <div className="flex-1 flex flex-col">
                <HeaderLayout />
                <main className="flex-1 overflow-auto bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
