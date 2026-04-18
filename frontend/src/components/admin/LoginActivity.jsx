import React, { useState, useEffect } from 'react';
import { Activity, Clock, ShieldCheck, User, Loader2, ArrowRight } from 'lucide-react';

const LoginActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://academic-wellness-performance-platform-3.onrender.com/api/admin/login-activity', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        }
      } catch (err) {
        console.error('Failed to fetch login activity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    }).format(date);
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <User className="w-3.5 h-3.5" /> Teacher
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <User className="w-3.5 h-3.5" /> Student
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Login Activity Feed</h2>
        <p className="text-slate-500 text-sm mt-1">Monitor recent platform access and user logins</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Activity className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-700">No login activity yet</p>
            <p className="text-sm">Activity will appear here when users log in.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.map((activity) => (
              <div key={activity._id} className="p-4 sm:p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex w-12 h-12 rounded-full bg-slate-100 items-center justify-center text-slate-500 border border-slate-200">
                    <ArrowRight className="w-5 h-5 -rotate-45" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-slate-900">{activity.name}</span>
                      {getRoleBadge(activity.role)}
                    </div>
                    <div className="text-sm text-slate-500">{activity.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start sm:self-auto">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{formatDate(activity.loginTime)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginActivity;
