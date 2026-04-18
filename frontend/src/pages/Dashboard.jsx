import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import Card from "../components/Card";
import TeacherDashboard from "../components/TeacherDashboard";
import { BookOpen, Moon, Activity, Trophy, Calendar, Target, Clock, GraduationCap, Plus, CheckCircle, Circle, AlertCircle, MessageCircle, Send } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from "axios";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h2>
          <p className="text-slate-600 mb-4">We encountered an error while loading the dashboard.</p>
          <pre className="bg-slate-100 p-4 rounded text-left overflow-auto text-xs text-red-500 max-w-lg mx-auto">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const Dashboard = () => {
  const [user, setUser] = useState({ name: "User", role: "student" });
  const [stats, setStats] = useState({
    avgMarks: 0,
    totalSubjects: 0,
    avgSleep: 0,
    totalExercise: 0,
  });

  // Focus Timer State
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      // Optional: Play a sound or show a notification
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(60 * 60);
  };
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Daily Goals State
  const [goals, setGoals] = useState([
    { id: 1, text: 'Read 20 pages', completed: false },
    { id: 2, text: 'Complete Math assignment', completed: false },
    { id: 3, text: 'Meditation 10m', completed: false }
  ]);
  const [newGoal, setNewGoal] = useState('');

  const toggleGoal = (id) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };
  
  const addGoal = (e) => {
    if (e.key === 'Enter' && newGoal.trim()) {
      setGoals([...goals, { id: Date.now(), text: newGoal.trim(), completed: false }]);
      setNewGoal('');
    }
  };

  const pendingGoalsCount = goals.filter(g => !g.completed).length;

  // Chat State
  const [doubtText, setDoubtText] = useState('');
  const [doubtStatus, setDoubtStatus] = useState(''); // idle, sending, sent
  const [messages, setMessages] = useState([]);

  const handleSendDoubt = async () => {
      if (!doubtText.trim()) return;
      setDoubtStatus('sending');
      try {
          const token = localStorage.getItem("token");
          await axios.post("https://academic-wellness-performance-platform-3.onrender.com/api/messages/send", {
              targetRole: 'teacher',
              content: doubtText
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setDoubtStatus('sent');
          setDoubtText('');
          // Refresh messages after sending
          const msgRes = await axios.get("https://academic-wellness-performance-platform-3.onrender.com/api/messages", {
              headers: { Authorization: `Bearer ${token}` }
          });
          setMessages(msgRes.data);
          setTimeout(() => setDoubtStatus('idle'), 3000);
      } catch (err) {
          console.error("Failed to send message", err);
          setDoubtStatus('idle');
      }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) { }
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        // Only fetch student stats if user is a student
        if (JSON.parse(localStorage.getItem("user"))?.role !== 'teacher') {
          const wellnessRes = await axios.get("https://academic-wellness-performance-platform-3.onrender.com/api/wellness/summary", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const academicRes = await axios.get("https://academic-wellness-performance-platform-3.onrender.com/api/academic", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const msgRes = await axios.get("https://academic-wellness-performance-platform-3.onrender.com/api/messages", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMessages(msgRes.data);

          const subjects = academicRes.data;
          const totalSubjects = subjects.length;
          const avgMarks = totalSubjects > 0
            ? (subjects.reduce((acc, curr) => acc + curr.marks, 0) / totalSubjects).toFixed(1)
            : 0;

          setStats({
            avgMarks,
            totalSubjects,
            avgSleep: wellnessRes.data.averageSleepHours || 0,
            totalExercise: wellnessRes.data.averageExerciseMinutes || 0
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };

    fetchStats();

  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <Layout>
      <ErrorBoundary>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              {getGreeting()}, {user.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              {user.role === 'teacher' ? "Here's an overview of your students' performance." : "Ready to crush your goals today? 🚀"}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 text-slate-600">
              <Calendar size={18} />
              <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            {user.role === 'teacher' && (
              <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-2 font-medium">
                <GraduationCap size={18} />
                Teacher Mode
              </div>
            )}
          </div>
        </div>

        {user.role === 'teacher' ? (
          <TeacherDashboard user={user} />
        ) : (
          /* Student Dashboard (Bento Grid) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Main Stats Row */}
            <StatsCard
              title="Average Score"
              value={`${stats.avgMarks}%`}
              icon={<Trophy size={24} />}
              color="blue"
              trend={2.5}
            />
            <StatsCard
              title="Active Subjects"
              value={stats.totalSubjects}
              icon={<BookOpen size={24} />}
              color="purple"
            />
            <StatsCard
              title="Sleep Quality"
              value={`${stats.avgSleep}h`}
              icon={<Moon size={24} />}
              color="orange"
              trend={-5}
            />
            <StatsCard
              title="Exercise Time"
              value={`${stats.totalExercise}m`}
              icon={<Activity size={24} />}
              color="green"
              trend={12}
            />

            {/* Large Chart/Focus Area (Spans 2 cols) */}
            <div className="lg:col-span-3">
              <Card className="h-full min-h-[300px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 text-lg">Performance Overview</h3>
                  {/* <select className="bg-slate-50 border-none text-slate-500 text-sm rounded-lg p-2 focus:ring-2 focus:ring-indigo-100">
                    <option>This Week</option>
                    <option>This Month</option>
                  </select> */}
                </div>
                <div className="flex-1 w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'Mon', score: 65, wellness: 70 },
                      { name: 'Tue', score: 75, wellness: 65 },
                      { name: 'Wed', score: 85, wellness: 80 },
                      { name: 'Thu', score: 80, wellness: 75 },
                      { name: 'Fri', score: 90, wellness: 85 },
                      { name: 'Sat', score: 88, wellness: 90 },
                      { name: 'Sun', score: 92, wellness: 88 },
                    ]}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorWellness" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                      <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" name="Performance" />
                      <Area type="monotone" dataKey="wellness" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWellness)" name="Wellness Score" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Side Widget (Spans 1 col) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Interactive Widget: Focus Timer */}
              <Card className="bg-indigo-600 text-white border-none shadow-indigo-200 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Clock className="text-indigo-200" />
                        <h3 className="font-bold">Focus Mode</h3>
                    </div>
                    {(isTimerRunning || timeLeft !== 60 * 60) && (
                        <button onClick={resetTimer} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors">
                            Reset
                        </button>
                    )}
                  </div>
                  <div className="text-center py-4">
                    <div className="text-5xl font-mono font-bold tracking-widest mb-2 font-variant-numeric:tabular-nums text-yellow-300 drop-shadow-md">{formatTime(timeLeft)}</div>
                    <p className="text-indigo-200 text-sm mb-6">Stay productive</p>
                    <button 
                        onClick={toggleTimer}
                        className={`px-6 py-2 rounded-full font-bold shadow-lg active:scale-95 transition-all w-full ${isTimerRunning ? 'bg-indigo-800 text-white hover:bg-indigo-700' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
                    >
                      {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
                    </button>
                  </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-[-30px] left-[-30px] w-24 h-24 bg-indigo-500/50 rounded-full blur-xl" />
              </Card>

              <Card className="bg-white border border-slate-100 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Target size={18} className="text-rose-500" />
                    Daily Goals
                    </h3>
                    {pendingGoalsCount > 0 && (
                        <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                            <AlertCircle size={12} /> {pendingGoalsCount} Left
                        </span>
                    )}
                </div>
                
                <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                  {goals.map((goal) => (
                    <div 
                        key={goal.id} 
                        onClick={() => toggleGoal(goal.id)}
                        className={`flex items-start gap-3 group cursor-pointer p-2 rounded-lg transition-colors ${goal.completed ? 'opacity-60 bg-slate-50' : 'hover:bg-slate-50'}`}
                    >
                      <div className="mt-0.5">
                        {goal.completed ? (
                            <CheckCircle size={18} className="text-green-500" />
                        ) : (
                            <Circle size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-700 group-hover:text-slate-900'}`}>{goal.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 relative">
                    <input 
                        type="text" 
                        placeholder="Add a new goal... (Press Enter)"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        onKeyDown={addGoal}
                        className="w-full text-sm outline-none px-2 py-1 placeholder-slate-400 text-slate-700 bg-slate-50 rounded"
                    />
                </div>
              </Card>

              {/* Ask Doubt Widget */}
              <Card className="bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white border-none shadow-fuchsia-200 relative overflow-hidden">
                  <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-3">
                          <MessageCircle size={20} className="text-fuchsia-200" />
                          <h3 className="font-bold text-lg">Ask a Doubt</h3>
                      </div>
                      <p className="text-fuchsia-100 text-sm mb-4">Send a direct message or feedback to your teachers.</p>
                      
                      <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                          <input 
                              type="text" 
                              value={doubtText}
                              onChange={(e) => setDoubtText(e.target.value)}
                              placeholder="Type your question for teachers..."
                              className="bg-transparent text-white placeholder-fuchsia-200 text-sm outline-none px-3 py-2 flex-1"
                              disabled={doubtStatus === 'sending' || doubtStatus === 'sent'}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendDoubt()}
                          />
                          <button 
                              onClick={handleSendDoubt}
                              disabled={!doubtText.trim() || doubtStatus === 'sending' || doubtStatus === 'sent'}
                              className="bg-white text-fuchsia-600 p-2 rounded-lg shadow-sm hover:bg-fuchsia-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                          >
                              {doubtStatus === 'sent' ? <CheckCircle size={18} className="text-green-500" /> : <Send size={18} />}
                          </button>
                      </div>
                      {doubtStatus === 'sent' && <p className="text-xs text-white mt-2 animate-pulse text-center">Message sent successfully!</p>}
                  </div>
                  <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl" />
              </Card>

              {/* Teacher Replies Widget */}
              <Card className="bg-white border border-slate-100 relative overflow-hidden flex flex-col max-h-[300px]">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <MessageCircle size={18} className="text-indigo-500" />
                          Teacher Replies
                      </h3>
                  </div>
                  <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                      {messages.filter(msg => msg.receiverId?._id === user.id || msg.senderId?.role === 'teacher').length > 0 ? (
                          messages.filter(msg => msg.receiverId?._id === user.id || msg.senderId?.role === 'teacher').map((msg) => (
                          <div key={msg._id} className="p-3 rounded-lg border border-indigo-100 bg-indigo-50/30">
                              <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[10px]">
                                          {msg.senderId?.name ? msg.senderId.name.charAt(0) : 'T'}
                                      </div>
                                      <h4 className="font-bold text-slate-800 text-xs">{msg.senderId?.name || 'Teacher'}</h4>
                                  </div>
                                  <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-slate-600 whitespace-pre-line">{msg.content}</p>
                          </div>
                      ))
                      ) : (
                          <div className="text-sm text-center text-slate-400 italic py-4">No recent replies from teachers.</div>
                      )}
                  </div>
              </Card>

            </div>
          </div>
        )}
      </ErrorBoundary>
    </Layout>
  );
};

export default Dashboard;