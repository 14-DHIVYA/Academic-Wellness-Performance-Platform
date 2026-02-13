import React from 'react';
import { X, BookOpen, Activity, Moon, TrendingUp, Calendar } from 'lucide-react';

const StudentDetailsModal = ({ student, onClose }) => {
    if (!student) return null;

    const { student: profile, academic, wellness } = student;

    // Calculate averages
    const avgMarks = academic.length > 0
        ? (academic.reduce((acc, curr) => acc + curr.marks, 0) / academic.length).toFixed(1)
        : 0;

    const avgSleep = wellness.length > 0
        ? (wellness.reduce((acc, curr) => acc + curr.sleepHours, 0) / wellness.length).toFixed(1)
        : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <p className="text-indigo-100">{profile.email}</p>
                        <div className="flex gap-4 mt-4">
                            <div className="bg-white/20 px-3 py-1 rounded-lg text-sm backdrop-blur-md">
                                Department: {profile.department || 'N/A'}
                            </div>
                            <div className="bg-white/20 px-3 py-1 rounded-lg text-sm backdrop-blur-md">
                                Semester: {profile.semester || 'N/A'}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm">Avg. Score</p>
                                <p className="text-2xl font-bold text-slate-800">{avgMarks}%</p>
                            </div>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                <Moon size={24} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm">Avg. Sleep</p>
                                <p className="text-2xl font-bold text-slate-800">{avgSleep}h</p>
                            </div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm">Goal Status</p>
                                <p className="text-2xl font-bold text-slate-800">On Track</p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Section */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BookOpen size={20} className="text-indigo-600" />
                            Academic Performance
                        </h3>
                        <div className="overflow-hidden border border-slate-200 rounded-xl">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="p-3">Subject</th>
                                        <th className="p-3">Marks</th>
                                        <th className="p-3">Grade</th>
                                        <th className="p-3">Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {academic.length > 0 ? academic.map((record, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="p-3 font-medium text-slate-700">{record.subject}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-md font-bold ${record.marks >= 80 ? 'bg-green-100 text-green-700' :
                                                        record.marks >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {record.marks}
                                                </span>
                                            </td>
                                            <td className="p-3 text-slate-600">{record.marks >= 90 ? 'A+' : record.marks >= 80 ? 'A' : 'B'}</td>
                                            <td className="p-3 text-slate-500">{new Date().toLocaleDateString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="p-4 text-center text-slate-400">No academic records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Wellness Section */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Activity size={20} className="text-indigo-600" />
                            Recent Wellness Logs
                        </h3>
                        <div className="space-y-3">
                            {wellness.length > 0 ? wellness.map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className=" bg-violet-50 p-2 rounded-lg text-violet-600">
                                            <Calendar size={18} />
                                        </div>
                                        <span className="font-medium text-slate-700">
                                            {new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-slate-600" title="Sleep">
                                            <Moon size={16} className="text-blue-400" />
                                            {log.sleepHours}h
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600" title="Exercise">
                                            <TrendingUp size={16} className="text-green-500" />
                                            {log.exerciseMinutes}m
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600" title="Mood">
                                            <span className="text-lg">😊</span> {/* Mapping mood to emoji could be improved */}
                                            {log.mood}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-4 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    No recent wellness activity logged.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentDetailsModal;
