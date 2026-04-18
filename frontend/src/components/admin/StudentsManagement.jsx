import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Loader2, UserX, Bookmark } from 'lucide-react';

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New student form state
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://academic-wellness-performance-platform.onrender.com/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setStudents(data);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://academic-wellness-performance-platform.onrender.com/api/admin/students', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newStudent)
      });
      
      const data = await response.json();
      if (response.ok) {
        setStudents([...students, data]);
        setIsModalOpen(false);
        setNewStudent({ name: '', email: '', password: '' });
      } else {
        setFormError(data.message || 'Failed to add student');
      }
    } catch (err) {
      setFormError('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student? Their email will be permanently blocked.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://academic-wellness-performance-platform.onrender.com/api/admin/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setStudents(students.filter(s => s._id !== id));
      } else {
        alert('Failed to delete student');
      }
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Students Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage student accounts and records</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          <span>Add Student</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Info</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Teacher</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <UserX className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-base font-medium text-slate-600">No students found</p>
                        <p className="text-sm">Try adjusting your search query</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{student.name}</div>
                            <div className="text-sm text-slate-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {student.assignedTeacher ? (
                          <div className="flex items-center gap-2">
                            <Bookmark className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-medium text-slate-700">{student.assignedTeacher.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteStudent(student._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto animate-in shrink-0 zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Add New Student</h3>
            <p className="text-sm text-slate-500 mb-6">Create a new student account.</p>
            
            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="e.g. Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newStudent.email}
                  onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="student@school.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newStudent.password}
                  onChange={e => setNewStudent({...newStudent, password: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-slate-600 hover:bg-slate-100 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-70"
                >
                  {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsManagement;
