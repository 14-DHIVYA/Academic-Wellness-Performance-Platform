import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://academic-wellness-performance-platform.onrender.com/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/admin-dashboard");
      } else {
        setError(data.message || "Invalid credentials. Admin access only.");
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 mt-20">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full -z-10 opacity-50 blur-2xl flex items-center justify-center pointer-events-none" />

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100">
                <ShieldCheck className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                Admin Portal
              </h1>
              <p className="text-slate-500">Secure access for administrators</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Admin Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                    <div className="h-10 w-10 flex items-center justify-center text-slate-400 group-focus-within:text-red-600 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all outline-none"
                    placeholder="admin@school.edu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                    <div className="h-10 w-10 flex items-center justify-center text-slate-400 group-focus-within:text-red-600 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Secure Login</span>
                    <LogIn className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;
