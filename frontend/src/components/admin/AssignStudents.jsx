import React, { useState, useEffect } from 'react';
import { Link2, Loader2, CheckCircle2, Search, User } from 'lucide-react';

const AssignStudents = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  const [assigningLoading, setAssigningLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [techRes, stuRes] = await Promise.all([
        fetch('https://academic-wellness-performance-platform-3.onrender.com/api/admin/teachers', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('https://academic-wellness-performance-platform-3.onrender.com/api/admin/students', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (techRes.ok && stuRes.ok) {
        const teachersData = await techRes.json();
        const studentsData = await stuRes.json();
        setTeachers(teachersData);
        setStudents(studentsData);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStudentToggle = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleAssign = async () => {
    if (!selectedTeacher || selectedStudents.length === 0) return;
    
    setAssigningLoading(true);
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://academic-wellness-performance-platform-3.onrender.com/api/admin/assign', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          teacherId: selectedTeacher,
          studentIds: selectedStudents
        })
      });

      if (response.ok) {
        setSuccessMessage(`Successfully assigned ${selectedStudents.length} student(s) to the selected teacher.`);
        setSelectedStudents([]);
        setSelectedTeacher('');
        // Refresh data to show updated assignments
        fetchData();
      } else {
        alert('Failed to assign students');
      }
    } catch (err) {
      console.error('Failed to assign:', err);
    } finally {
      setAssigningLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Assign Students</h2>
        <p className="text-slate-500 text-sm mt-1">Link students to their respective teachers</p>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <p className="font-medium text-sm">{successMessage}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-12 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teacher Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center text-red-600 text-xs shadow-inner">1</span>
                Select Teacher
              </h3>
              
              <div className="space-y-3">
                {teachers.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No teachers available.</p>
                ) : (
                  teachers.map(teacher => (
                    <label 
                      key={teacher._id}
                      className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                        selectedTeacher === teacher._id 
                          ? 'border-red-500 bg-red-50/50 shadow-sm' 
                          : 'border-slate-200 hover:border-red-200 hover:bg-slate-50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="teacher" 
                        value={teacher._id}
                        checked={selectedTeacher === teacher._id}
                        onChange={() => setSelectedTeacher(teacher._id)}
                        className="w-4 h-4 text-red-600 border-slate-300 focus:ring-red-500"
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-slate-900">{teacher.name}</p>
                        <p className="text-xs text-slate-500">{teacher.assignedStudents?.length || 0} students assigned</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Students Selection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
              <div className="p-5 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs shadow-inner">2</span>
                    Select Students ({selectedStudents.length} selected)
                  </h3>
                  
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Select multiple students to assign them to the chosen teacher.</span>
                  <button 
                    onClick={() => setSelectedStudents(filteredStudents.map(s => s._id))}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Select All Visible
                  </button>
                </div>
              </div>

              <div className="p-2 flex-1 overflow-y-auto max-h-[500px]">
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm">No students found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredStudents.map(student => (
                      <label 
                        key={student._id}
                        className={`flex items-start p-3 border rounded-xl cursor-pointer transition-all ${
                          selectedStudents.includes(student._id)
                            ? 'border-indigo-500 bg-indigo-50/50' 
                            : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedStudents.includes(student._id)}
                          onChange={() => handleStudentToggle(student._id)}
                          className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <div className="ml-3 flex-1 overflow-hidden">
                          <p className="text-sm font-medium text-slate-900 truncate">{student.name}</p>
                          <p className="text-xs text-slate-500 truncate">{student.email}</p>
                          {student.assignedTeacher ? (
                            <p className="mt-1 text-[10px] uppercase font-bold text-slate-400">
                              Currently: {student.assignedTeacher.name}
                            </p>
                          ) : (
                            <p className="mt-1 text-[10px] uppercase font-bold text-emerald-500">
                              Unassigned
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={handleAssign}
                  disabled={!selectedTeacher || selectedStudents.length === 0 || assigningLoading}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-slate-200"
                >
                  {assigningLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Link2 size={18} />
                      <span>Confirm Assignment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignStudents;
