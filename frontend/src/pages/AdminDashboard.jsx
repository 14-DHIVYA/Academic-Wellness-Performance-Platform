import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Link as LinkIcon, 
  Activity, 
  Ban,
  LogOut,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import TeachersManagement from '../components/admin/TeachersManagement';
import StudentsManagement from '../components/admin/StudentsManagement';
import AssignStudents from '../components/admin/AssignStudents';
import LoginActivity from '../components/admin/LoginActivity';
import BlockedUsers from '../components/admin/BlockedUsers';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setAdminName(user.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin-login');
  };

  const navItems = [
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'assign', label: 'Assign Students', icon: LinkIcon },
    { id: 'activity', label: 'Login Activity', icon: Activity },
    { id: 'blocked', label: 'Blocked Users', icon: Ban },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'teachers':
        return <TeachersManagement />;
      case 'students':
        return <StudentsManagement />;
      case 'assign':
        return <AssignStudents />;
      case 'activity':
        return <LoginActivity />;
      case 'blocked':
        return <BlockedUsers />;
      default:
        return <TeachersManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 justify-between flex items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <ShieldCheck className="text-red-600 w-6 h-6" />
          Admin Portal
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 hidden md:flex items-center gap-3 text-white font-bold text-xl border-b border-slate-800">
            <ShieldCheck className="text-red-500 w-8 h-8" />
            Admin Portal
          </div>

          <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-red-200' : 'text-slate-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-800">
            <div className="mb-4 px-4 py-3 bg-slate-800/50 rounded-xl">
              <p className="text-xs text-slate-400 mb-1">Logged in as</p>
              <p className="font-medium text-white truncate">{adminName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto w-full">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
