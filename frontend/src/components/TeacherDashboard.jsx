import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, BookOpen, Activity, Search, RefreshCw, Trophy, AlertTriangle } from "lucide-react";
import Card from "./Card";
import StatsCard from "./StatsCard";
import StudentDetailsModal from "./StudentDetailsModal";

const TeacherDashboard = ({ user }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStudents = async () => {
        try {
            setRefreshing(true);
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/teacher/students", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(res.data);
        } catch (error) {
            console.error("Error fetching students assigned to teacher", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleViewDetails = async (studentId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:5000/api/teacher/students/${studentId}`, {
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

    const filteredStudents = safeStudents.filter(student =>
        (student?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <StatsCard
                    title="Needs Attention"
                    value={lowPerformers}
                    icon={<AlertTriangle size={24} />}
                    color="orange"
                />
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Student List</h2>
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
                        onClick={fetchStudents}
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
