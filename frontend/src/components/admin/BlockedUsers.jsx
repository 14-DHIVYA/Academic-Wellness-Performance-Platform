import React, { useState, useEffect } from 'react';
import { Ban, Loader2, Calendar, UserX } from 'lucide-react';

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocked = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://academic-wellness-performance-platform.onrender.com/api/admin/blocked-users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setBlockedUsers(data);
        }
      } catch (err) {
        console.error('Failed to fetch blocked users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocked();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Blocked Accounts</h2>
        <p className="text-slate-500 text-sm mt-1">Users permanently removed and prohibited from re-registering</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Previous Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Blocked Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {blockedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <UserX className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="text-base font-medium text-slate-600">No blocked users</p>
                        <p className="text-sm">The platform is running smoothly with no banned accounts.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  blockedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-sm font-medium text-slate-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {formatDate(user.deletedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          <Ban className="w-3.5 h-3.5" />
                          Permanently Blocked
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockedUsers;
