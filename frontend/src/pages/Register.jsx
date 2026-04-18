import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://academic-wellness-performance-platform.onrender.com/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      alert("Registration Successful");
      navigate("/");
    } catch (error) {
      alert("Error Registering");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-900" />
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

        <div className="relative z-10 text-white max-w-lg text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Join the Elite Community</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Connect with thousands of students and teachers improving academic life through data-driven insights. It starts here.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
            <p className="text-slate-500 mt-2">Start your journey with StudentSync today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="student@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">I am a</label>
              <div className="flex gap-4">
                <label className={`flex-1 cursor-pointer p-3 rounded-xl border-2 text-center transition-all ${role === 'student' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden"
                  />
                  Student
                </label>
                <label className={`flex-1 cursor-pointer p-3 rounded-xl border-2 text-center transition-all ${role === 'teacher' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={role === 'teacher'}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden"
                  />
                  Teacher
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Create Account</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;