import React from "react";
import Sidebar from "./Sidebar";
// import Navbar from "../pages/Navbar"; // Navbar might be redundant with the new sidebar design, or we can keep it for mobile

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <Sidebar />

            <div className="flex-1 ml-80 p-8 relative z-10">
                <div className="max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
