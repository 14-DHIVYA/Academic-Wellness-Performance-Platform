import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, BookOpen, Activity, Search, RefreshCw, Trophy, AlertTriangle, TrendingUp, Inbox, Check } from "lucide-react";
import Card from "./Card";
import StatsCard from "./StatsCard";
import StudentDetailsModal from "./StudentDetailsModal";

const TeacherDashboard = ({ user }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [filterAttention, setFilterAttention] = useState(false);
    const [messages, setMessages] = useState([]);
    const [replyTexts, setReplyTexts] = useState({});
    const [replyStatus, setReplyStatus] = useState({});

    const fetchDashboardData = async () => {
        try {
            setRefreshing(true);
            const token = localStorage.getItem("token");
            
            // Fetch Students
            const studentRes = await axios.get("https://academic-wellness-performance-platform.onrender.com/api/teacher/students", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(studentRes.data);

            // Fetch Messages
            const msgRes = await axios.get("https://academic-wellness-performance-platform.onrender.com/api/messages", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(msgRes.data);

        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const markMessageRead = async (msgId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`https://academic-wellness-performance-platform.onrender.com/api/messages/${msgId}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(messages.map(m => m._id === msgId ? { ...m, isRead: true } : m));
        } catch(error) {
            console.error("Failed to mark message as read");
        }
    };

    const handleReplyTextChange = (msgId, text) => {
        setReplyTexts(prev => ({ ...prev, [msgId]: text }));
    };

    const handleSendReply = async (msg) => {
        const text = replyTexts[msg._id];
        if (!text || !text.trim()) return;
        
        setReplyStatus(prev => ({...prev, [msg._id]: 'sending'}));
        try {
            const token = localStorage.getItem("token");
            await axios.post("https://academic-wellness-performance-platform.onrender.com/api/messages/send", {
                targetRole: 'student',
                receiverId: msg.senderId._id,
                content: `Re: ${msg.content.substring(0, 20)}... \n\nTeacher Reply: ${text}`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReplyStatus(prev => ({...prev, [msg._id]: 'sent'}));
            setReplyTexts(prev => ({ ...prev, [msg._id]: '' }));
            if (!msg.isRead) markMessageRead(msg._id);
            setTimeout(() => setReplyStatus(prev => ({...prev, [msg._id]: 'idle'})), 3000);
        } catch (err) {
            console.error("Failed to send reply", err);
            setReplyStatus(prev => ({...prev, [msg._id]: 'error'}));
        }
    };

    const handleViewDetails = async (studentId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`https://academic-wellness-performance-platform.onrender.com/api/teacher/students/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedStudent(res.data);
        } catch (error) {
            console.error("Error fetching student details", error);
            alert("Failed to load student details");
        }
    };

    // Calculate Class Stats with Safety Checks
    const safeStudents = Array.isArray(students) ? students : [];
    const totalStudents = safeStudents.length;

    const classAvg = totalStudents > 0
        ? (safeStudents.reduce((acc, curr) => acc + (parseFloat(curr?.stats?.avgMarks) || 0), 0) / totalStudents).toFixed(1)
        : 0;

    const lowPerformers = safeStudents.filter(s => (parseFloat(s?.stats?.avgMarks) || 0) < 60).length;

    const filteredStudents = safeStudents.filter(student => {
        const matchesSearch = (student?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (student?.email || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAttention = filterAttention ? (parseFloat(student?.stats?.avgMarks) || 0) < 60 : true;
        return matchesSearch && matchesAttention;
    }).sort((a, b) => {
        const nameA = (a?.name || "").toLowerCase();
        const nameB = (b?.name || "").toLowerCase();
        return nameA.localeCompare(nameB);
    });

    // Sort students by performance for Toppers/Bottom lists
    const sortedByPerformance = [...safeStudents].sort((a, b) => {
        return (parseFloat(b?.stats?.avgMarks) || 0) - (parseFloat(a?.stats?.avgMarks) || 0);
    });
    
    // Top 3 students (Highest marks)
    const topPerformers = sortedByPerformance.slice(0, 3).filter(s => (parseFloat(s?.stats?.avgMarks) || 0) > 0);
    
    // Debugging Logs
    console.log("TeacherDashboard Render:", { loading, studentsCount: students?.length, safeStudentsCount: safeStudents?.length, classAvg, error: null });

    if (!Array.isArray(students) && !loading) {
        console.error("Critical Error: 'students' state is not an array:", students);
        return <div className="text-red-500 p-4">Error: Invalid student data format. Please contact support.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Class Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Students"
                    value={totalStudents}
                    icon={<User size={24} />}
                    color="indigo"
                />
                <StatsCard
                    title="Class Average"
                    value={`${classAvg}%`}
                    icon={<Trophy size={24} />}
                    color="blue"
                    trend={1.2}
                />
                <div 
                    onClick={() => setFilterAttention(!filterAttention)} 
                    className={`cursor-pointer transition-all ${filterAttention ? 'ring-4 ring-orange-400 ring-opacity-50 rounded-2xl scale-105' : 'hover:scale-105'}`}
                    title="Click to toggle filter for students needing attention"
                >
                    <StatsCard
                        title="Needs Attention"
                        value={lowPerformers}
                        icon={<AlertTriangle size={24} />}
                        color="orange"
                    />
                </div>
            </div>

            {/* Performance Snapshot Boards */}
            {topPerformers.length > 0 && (
                <div className="grid grid-cols-1 gap-6">
                    {/* Top Performers */}
                    <Card className="bg-white border border-slate-100 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <TrendingUp size={18} className="text-emerald-500" />
                                Top Performers
                            </h3>
                            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Leaders</span>
                        </div>
                        <div className="space-y-3">
                            {topPerformers.length > 0 ? topPerformers.map((student, idx) => (
                                <div key={student._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="font-bold text-slate-400 w-4">{idx + 1}</div>
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                                            {student.name ? student.name.charAt(0) : '?'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{student.name}</h4>
                                        </div>
                                    </div>
                                    <div className="font-bold text-emerald-600">{student.stats?.avgMarks || 0}%</div>
                                </div>
                            )) : (
                                <div className="text-sm text-slate-400 italic py-2">Not enough data to determine leaders.</div>
                            )}
                        </div>
                    </Card>

                    {/* Recent Student Queries */}
                    <Card className="bg-white border border-slate-100 relative overflow-hidden flex flex-col max-h-[400px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Inbox size={18} className="text-indigo-500" />
                                Student Queries & Feedback
                            </h3>
                            {messages.filter(m => !m.isRead).length > 0 && (
                                <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{messages.filter(m => !m.isRead).length} New</span>
                            )}
                        </div>
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                            {messages.length > 0 ? messages.map((msg) => (
                                <div key={msg._id} className={`p-3 rounded-lg border transition-colors ${msg.isRead ? 'border-slate-100 bg-slate-50 opacity-70' : 'border-indigo-100 bg-indigo-50/30'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[10px]">
                                                {msg.senderId?.name ? msg.senderId.name.charAt(0) : '?'}
                                            </div>
                                            <h4 className="font-bold text-slate-800 text-xs">{msg.senderId?.name || 'Student'}</h4>
                                        </div>
                                        <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 mb-2">{msg.content}</p>
                                    
                                    {/* Reply Section */}
                                    {!msg.isRead && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <input 
                                                type="text"
                                                placeholder="Type a reply..."
                                                value={replyTexts[msg._id] || ""}
                                                onChange={(e) => handleReplyTextChange(msg._id, e.target.value)}
                                                disabled={replyStatus[msg._id] === 'sending'}
                                                className="text-xs px-2 py-1 rounded border border-slate-200 flex-1 outline-none focus:border-indigo-400"
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendReply(msg)}
                                            />
                                            <button 
                                                onClick={() => handleSendReply(msg)}
                                                disabled={!replyTexts[msg._id] || replyStatus[msg._id] === 'sending'}
                                                className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                                                title="Send Reply"
                                            >
                                                {replyStatus[msg._id] === 'sent' ? <Check size={14} className="text-green-300" /> : <TrendingUp size={14} />}
                                            </button>
                                        </div>
                                    )}
                                    {replyStatus[msg._id] === 'sent' && <p className="text-[10px] text-green-600 mt-1">Reply sent successfully!</p>}

                                    {!msg.isRead && (
                                        <button 
                                            onClick={() => markMessageRead(msg._id)}
                                            className="text-[10px] flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium mt-2"
                                        >
                                            <Check size={10} /> Mark as Reviewed
                                        </button>
                                    )}
                                </div>
                            )) : (
                                <div className="text-sm text-center text-slate-400 italic py-4">No recent messages or queries.</div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Student List {filterAttention && <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded-full ml-2 align-middle">Needs Attention Filter</span>}</h2>
                    <p className="text-slate-500">Managing {filteredStudents.length} of {totalStudents} students</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        disabled={refreshing}
                        className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-50"
                        title="Refresh Data"
                    >
                        <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading student data...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredStudents.map((student) => (
                        <Card key={student._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {student.name ? student.name.charAt(0) : '?'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{student.name || 'Unknown'}</h3>
                                    <p className="text-sm text-slate-500">{student.email || 'No Email'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <div className="flex items-center gap-1 text-slate-500 text-xs uppercase font-bold mb-1">
                                        <BookOpen size={12} /> Avg Marks
                                    </div>
                                    <span className="text-lg font-bold text-slate-800">{student.stats?.avgMarks || 0}%</span>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center gap-1 text-slate-500 text-xs uppercase font-bold mb-1">
                                        <Activity size={12} /> Wellness
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg">{student.stats?.latestWellness?.sleep || 0}h Sleep</span>
                                        <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-lg">{student.stats?.latestWellness?.exercise || 0}m Ex</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleViewDetails(student._id)}
                                    className="text-indigo-600 font-medium hover:text-indigo-700 text-sm"
                                >
                                    View Details
                                </button>
                            </div>
                        </Card>
                    ))}

                    {filteredStudents.length === 0 && (
                        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                            No students found matching your search.
                        </div>
                    )}
                </div>
            )}

            {/* Student Details Modal */}
            {selectedStudent && (
                <StudentDetailsModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
};

export default TeacherDashboard;
