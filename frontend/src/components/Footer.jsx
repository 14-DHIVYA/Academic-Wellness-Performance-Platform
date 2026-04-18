import React from 'react';
import { GraduationCap, Twitter, Linkedin, Facebook, Instagram, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-white mb-6">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                <GraduationCap size={24} />
                            </div>
                            StudentSync
                        </Link>
                        <p className="text-slate-400 mb-6">
                            Empowering students and educators with data-driven insights for better academic and wellness outcomes.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Product</h3>
                        <ul className="space-y-4">
                            <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Testimonials</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Integration</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Resources</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Community</a></li>
                            <li><Link to="/admin-login" className="hover:text-red-400 transition-colors flex items-center gap-1.5"><ShieldCheck size={14} /> Admin Portal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Legal</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p>© 2024 StudentSync Platform. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart size={16} className="text-red-500 fill-red-500" /> for better education.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
