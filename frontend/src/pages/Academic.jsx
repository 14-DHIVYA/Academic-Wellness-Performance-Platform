import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Plus, Trash2, Calculator } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Academic = () => {
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({
        subject: "",
        marks: "",
        semester: "",
        date: new Date().toISOString().split("T")[0]
    });

    const [loading, setLoading] = useState(true);
    const [globalAvgGPA, setGlobalAvgGPA] = useState(0);
    const [highestClassGPA, setHighestClassGPA] = useState(0);
    const [isHighestScorer, setIsHighestScorer] = useState(false);

    const calculateGPA = (marks) => {
        if (marks >= 90) return 4.0;
        if (marks >= 80) return 3.0;
        if (marks >= 70) return 2.0;
        if (marks >= 60) return 1.0;
        return 0.0;
    };

    const currentGPA = subjects.length > 0
        ? (subjects.reduce((sum, sub) => sum + calculateGPA(sub.marks), 0) / subjects.length)
        : 0;

    // Fetch data
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            
            // Fetch student's academic records
            const res = await axios.get("https://academic-wellness-performance-platform.onrender.com/api/academic", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(res.data);
            
            // Fetch global average and highest marks
            const avgRes = await axios.get("https://academic-wellness-performance-platform.onrender.com/api/academic/average", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const globalMarks = avgRes.data.averageMarks;
            const topMarks = avgRes.data.highestMarks;
            const topScorerBoolean = avgRes.data.isHighestScorer;
            
            setGlobalAvgGPA(calculateGPA(globalMarks));
            setHighestClassGPA(calculateGPA(topMarks));
            setIsHighestScorer(topScorerBoolean);
            
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("https://academic-wellness-performance-platform.onrender.com/api/academic/add", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
            setFormData({ subject: "", marks: "", semester: "", date: new Date().toISOString().split("T")[0] });
        } catch (error) {
            console.error(error);
            alert("Error adding subject");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subject?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://academic-wellness-performance-platform.onrender.com/api/academic/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Error deleting subject");
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Academic Performance</h1>

            {/* Input Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">Add Subject Mark</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                        <input
                            type="number"
                            name="marks"
                            value={formData.marks}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                        <input
                            type="text"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> Add
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Table (Spans 2 cols) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Subject List</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 text-gray-600">Subject</th>
                                    <th className="pb-3 text-gray-600">Marks</th>
                                    <th className="pb-3 text-gray-600">Semester</th>
                                    <th className="pb-3 text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="py-4 text-center">Loading...</td></tr>
                                ) : (
                                    subjects.map((sub, index) => (
                                        <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                            <td className="py-3 font-medium text-slate-800">{sub.subject}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${sub.marks >= 80 ? 'bg-green-100 text-green-700' : sub.marks >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                    {sub.marks}%
                                                </span>
                                            </td>
                                            <td className="py-3 text-gray-500">{sub.semester}</td>
                                            <td className="py-3">
                                                <button onClick={() => handleDelete(sub._id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Chart + GPA Simulator */}
                <div className="space-y-6">
                    {/* Enhanced Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={subjects}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="marks" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Interactive Widget: GPA Simulator */}
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">GPA Simulator</h3>
                                <p className="text-indigo-200 text-sm">Goal: Highest Scorer</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Calculator size={20} className="text-white" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                                <span className="text-sm font-medium">Highest Class GPA</span>
                                <span className="font-bold text-lg">{highestClassGPA.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                                <span className="text-sm font-medium">Your Current GPA</span>
                                <span className="font-bold text-lg">{currentGPA.toFixed(2)}</span>
                            </div>
                            
                            {currentGPA > 0 && currentGPA >= highestClassGPA && isHighestScorer ? (
                                <div className="text-center py-4 bg-yellow-400 text-yellow-900 rounded-xl border border-yellow-300 mt-2 shadow-lg animate-bounce">
                                    <div className="text-3xl mb-1">🏆</div>
                                    <div className="font-extrabold tracking-tight px-2 leading-tight">
                                        CONGRATS YOU HAVE SET THE NEW GPA AND YOU ARE THE HIGHEST AMONG ALL THE STUDENTS
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 bg-white/5 rounded-xl border border-white/10 mt-2">
                                    <div className="text-sm text-indigo-200 uppercase tracking-wider font-semibold mb-1">Remaining Points</div>
                                    <div className="text-4xl font-extrabold tracking-tight">
                                        {Math.max(0, (highestClassGPA - currentGPA)).toFixed(2)}
                                    </div>
                                    <div className="text-xs text-indigo-200 mt-2">
                                        {(highestClassGPA - currentGPA) <= 0 
                                            ? "You are at or above the highest GPA! Great job!"
                                            : "Points to attain the highest class GPA"}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Academic;
