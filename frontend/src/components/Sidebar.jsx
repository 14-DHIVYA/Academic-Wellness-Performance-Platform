import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Activity, LayoutDashboard, LogOut, GraduationCap } from "lucide-react";

const Sidebar = () => {
    const location = useLocation();

    const [userRole, setUserRole] = React.useState("student");

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserRole(parsedUser.role || "student");
            } catch (error) {
                console.error("Error parsing user from local storage", error);
            }
        }
    }, []);

    const getOverviewPath = () => {
        if (userRole === "teacher") return "/teacher-dashboard";
        if (userRole === "admin") return "/admin-dashboard";
        return "/student-dashboard";
    };

    const allMenuItems = [
        { path: getOverviewPath(), name: "Overview", icon: LayoutDashboard },
        { path: "/academic", name: "Academics", icon: GraduationCap },
        { path: "/wellness", name: "Wellness", icon: Activity },
    ];

    const menuItems = userRole === 'teacher'
        ? allMenuItems.filter(item => item.path === getOverviewPath())
        : allMenuItems;

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <aside className="fixed left-4 top-4 bottom-4 w-72 bg-slate-900/95 text-white rounded-3xl p-6 flex flex-col shadow-2xl backdrop-blur-xl z-50 border border-slate-800">
            {/* Logo Area */}
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <BookOpen className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">StudentSync</h1>
                    <span className="text-xs text-slate-400 font-medium tracking-wide">PRO EDITION</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-indigo-600/10 text-indigo-400 font-semibold"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                }
                            `}
                        >
                            {isActive && (
                                <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                            )}
                            <item.icon
                                size={22}
                                className={`transition-colors ${isActive ? "text-indigo-400" : "group-hover:text-white"}`}
                            />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="pt-6 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full rounded-xl transition-all group"
                >
                    <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
