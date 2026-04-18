import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, GraduationCap } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-slate-800">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <GraduationCap size={24} />
                    </div>
                    StudentSync
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <button onClick={() => scrollToSection('features')} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                        Features
                    </button>

                    <Link to="/student-login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                        Student Login
                    </Link>
                    <Link to="/teacher-login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                        Teacher Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-slate-800 p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-2">
                    <button onClick={() => scrollToSection('features')} className="text-left text-slate-600 font-medium py-2">
                        Features
                    </button>

                    <div className="h-px bg-slate-100 my-2" />
                    <Link to="/student-login" className="text-center text-indigo-600 font-bold py-3 border border-indigo-100 rounded-xl">
                        Student Login
                    </Link>
                    <Link to="/teacher-login" className="text-center text-slate-600 font-bold py-3 border border-slate-100 rounded-xl">
                        Teacher Login
                    </Link>
                    <Link to="/register" className="text-center bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200">
                        Get Started Free
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
