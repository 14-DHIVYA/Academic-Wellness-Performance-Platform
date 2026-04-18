import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap,
    Activity,
    BarChart3,
    ArrowRight,
    Sparkles,
    Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
    const navigate = useNavigate();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleRoleSelect = (role) => {
        navigate(`/login?role=${role}`);
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-200/40 blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-200/40 blur-3xl animate-pulse" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-indigo-100 text-indigo-700 font-medium text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles size={16} />
                        <span>Reimagining Student Success</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Unlock Your Full <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Academic Potential</span>
                    </h1>

                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        StudentSync bridges the gap between academic performance and personal wellness.
                        Track grades, monitor health, and achieve balance in one beautiful platform.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full sm:w-auto btn-primary text-lg px-8 py-4 shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transform transition-all hover:-translate-y-1"
                        >
                            Get Started for Free
                            <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => document.getElementById('features').scrollIntoView()}
                            className="w-full sm:w-auto btn-secondary text-lg px-8 py-4"
                        >
                            Explore Features
                        </button>
                    </div>


                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Everything you need to excel</h2>
                        <p className="section-subtitle">Comprehensive tools designed for students.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<BarChart3 size={32} className="text-indigo-600" />}
                            title="Performance Analytics"
                            description="Visualize your academic progress with intuitive charts and real-time grade tracking."
                        />
                        <FeatureCard
                            icon={<Activity size={32} className="text-green-500" />}
                            title="Wellness Monitoring"
                            description="Track sleep, exercise, and mental well-being to maintain a healthy study-life balance."
                        />
                        <FeatureCard
                            icon={<Zap size={32} className="text-amber-500" />}
                            title="Real-time Updates"
                            description="Get instant notifications for new grades, assignments, and wellness milestones."
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="glass-card p-8 rounded-2xl">
        <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 shadow-inner">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
);

export default LandingPage;
