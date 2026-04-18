import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, ArrowRight, BookOpen, Mail } from "lucide-react";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const role = "student";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://academic-wellness-performance-platform.onrender.com/api/auth/login", {
        email,
        password,
      });

      if (res.data.user.role !== role) {
        alert(`Access Denied: This account is not registered as a ${role}.`);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/student-dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12 bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-900" />
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

        <div className="relative z-10 text-white max-w-lg text-center">
          <div className="inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-sm mb-6 shadow-xl">
            <BookOpen size={48} />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">Student Portal</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Track your academic journey and wellness goals in one place.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 mb-4 inline-block">&larr; Back to Home</Link>
            <h2 className="text-3xl font-bold text-slate-900">Student Login</h2>
            <p className="text-slate-500 mt-2">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 rounded-lg">Email Address</label>
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Sign In</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
