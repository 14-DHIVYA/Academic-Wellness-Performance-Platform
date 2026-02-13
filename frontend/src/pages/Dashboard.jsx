import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import Card from "../components/Card";
import TeacherDashboard from "../components/TeacherDashboard";
import { BookOpen, Moon, Activity, Trophy, Calendar, Target, Clock, GraduationCap } from "lucide-react";
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
          const wellnessRes = await axios.get("http://localhost:5000/api/wellness/summary", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const academicRes = await axios.get("http://localhost:5000/api/academic", {
            headers: { Authorization: `Bearer ${token}` }
          });

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
                  <select className="bg-slate-50 border-none text-slate-500 text-sm rounded-lg p-2 focus:ring-2 focus:ring-indigo-100">
                    <option>This Week</option>
                    <option>This Month</option>
                  </select>
                </div>
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                  <div className="text-center text-slate-400">
                    <Activity size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Chart Data Visualization</p>
                    <span className="text-xs">(Integration coming soon)</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Side Widget (Spans 1 col) */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-indigo-600 text-white border-none shadow-indigo-200">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="text-indigo-200" />
                  <h3 className="font-bold">Weekly Goal</h3>
                </div>
                <div className="text-3xl font-bold mb-1">85%</div>
                <div className="text-indigo-200 text-sm mb-4">Maintain average grade</div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-[85%]" />
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        <Clock size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">Updated Math Grade</p>
                        <p className="text-xs text-slate-400">2 hours ago</p>
                      </div>
                    </div>
                  ))}
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