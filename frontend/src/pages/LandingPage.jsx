import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        navigate(`/login?role=${role}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-50 flex flex-col items-center justify-center p-6 text-center">

            <div className="max-w-4xl w-full animate-in fade-in zoom-in duration-500">
                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                    Welcome to <span className="text-indigo-600">StudentSync</span>
                </h1>
                <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
                    The all-in-one platform for academic performance tracking and student wellness monitoring.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* Student Card */}
                    <div
                        onClick={() => handleRoleSelect('student')}
                        className="group relative bg-white border border-slate-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:border-indigo-200 transition-all cursor-pointer overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="mb-6 inline-flex p-4 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">I am a Student</h2>
                        <p className="text-slate-500 mb-6">Access your personal dashboard, track your grades, and monitor your wellness.</p>
                        <div className="flex items-center justify-center gap-2 text-indigo-600 font-semibold group-hover:gap-4 transition-all">
                            Student Login <ArrowRight size={20} />
                        </div>
                    </div>

                    {/* Teacher Card */}
                    <div
                        onClick={() => handleRoleSelect('teacher')}
                        className="group relative bg-white border border-slate-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:border-violet-200 transition-all cursor-pointer overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="mb-6 inline-flex p-4 rounded-2xl bg-violet-50 text-violet-600 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">I am a Teacher</h2>
                        <p className="text-slate-500 mb-6">Manage your classes, view student performance, and track class wellness trends.</p>
                        <div className="flex items-center justify-center gap-2 text-violet-600 font-semibold group-hover:gap-4 transition-all">
                            Teacher Login <ArrowRight size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 text-slate-400 text-sm">
                © 2024 StudentSync Platform. All rights reserved.
            </div>
        </div>
    );
};

export default LandingPage;
