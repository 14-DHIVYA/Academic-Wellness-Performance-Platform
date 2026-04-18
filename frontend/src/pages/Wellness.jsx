import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Plus, Trash2, Wind, Droplets } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const Wellness = () => {
    const [activities, setActivities] = useState([]);
    const [formData, setFormData] = useState({
        mood: "",
        exerciseMinutes: "",
        sleepHours: "",
        date: new Date().toISOString().split("T")[0],
    });

    const [loading, setLoading] = useState(true);

    const [breatheState, setBreatheState] = useState("idle"); // idle, inhale, hold, exhale
    const [breatheTime, setBreatheTime] = useState(0);

    const startBreathing = () => {
        if (breatheState !== "idle") return; // active
        setBreatheState("inhale");
        setBreatheTime(4);
    };

    useEffect(() => {
        let timer;
        if (breatheState !== "idle" && breatheTime > 0) {
            timer = setTimeout(() => setBreatheTime(breatheTime - 1), 1000);
        } else if (breatheState === "inhale" && breatheTime === 0) {
            setBreatheState("hold");
            setBreatheTime(7);
        } else if (breatheState === "hold" && breatheTime === 0) {
            setBreatheState("exhale");
            setBreatheTime(8);
        } else if (breatheState === "exhale" && breatheTime === 0) {
            setBreatheState("idle");
        }
        return () => clearTimeout(timer);
    }, [breatheState, breatheTime]);

    const [waterGlasses, setWaterGlasses] = useState(0);
    const goalGlasses = 8;

    // Fetch data
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://academic-wellness-performance-platform.onrender.com/api/wellness", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setActivities(res.data.data); // Adjust based on API structure
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("https://academic-wellness-performance-platform.onrender.com/api/wellness", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchData();
            setFormData({
                mood: "",
                exerciseMinutes: "",
                sleepHours: "",
                date: new Date().toISOString().split("T")[0],
            });
        } catch (error) {
            console.error(error);
            alert("Error adding wellness entry");
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://academic-wellness-performance-platform.onrender.com/api/wellness/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Error deleting entry");
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Wellness Tracker</h1>

            {/* Input Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">Log Daily Wellness</h2>
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mood (1-10)
                        </label>
                        <select
                            name="mood"
                            value={formData.mood}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            required
                        >
                            <option value="">Select</option>
                            <option value="Happy">Happy</option>
                            <option value="Neutral">Neutral</option>
                            <option value="Stressed">Stressed</option>
                            <option value="Tired">Tired</option>
                            <option value="Energetic">Energetic</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Exercise (mins)
                        </label>
                        <input
                            type="number"
                            name="exerciseMinutes"
                            value={formData.exerciseMinutes}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sleep (hours)
                        </label>
                        <input
                            type="number"
                            name="sleepHours"
                            value={formData.sleepHours}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> Add
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Table (Spans 2 cols) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Recent Logs</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 text-gray-600">Date</th>
                                    <th className="pb-3 text-gray-600">Mood</th>
                                    <th className="pb-3 text-gray-600">Sleep</th>
                                    <th className="pb-3 text-gray-600">Exercise</th>
                                    <th className="pb-3 text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : (
                                    activities.map((act, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="py-3">
                                                {new Date(act.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${act.mood === "Happy"
                                                        ? "bg-green-100 text-green-700"
                                                        : act.mood === "Stressed"
                                                            ? "bg-red-100 text-red-700"
                                                            : act.mood === "Energetic"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {act.mood}
                                                </span>
                                            </td>
                                            <td className="py-3">{act.sleepHours}h</td>
                                            <td className="py-3">{act.exerciseMinutes}m</td>
                                            <td className="py-3">
                                                <button
                                                    onClick={() => handleDelete(act._id)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Widgets */}
                <div className="space-y-6">
                    {/* Wellness Trends Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Wellness Trends</h2>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={activities}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="createdAt" hide />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                    <Line type="monotone" dataKey="sleepHours" stroke="#8884d8" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="exerciseMinutes" stroke="#82ca9d" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Interactive Widget: Breathing Exercise */}
                    <div 
                        onClick={startBreathing}
                        className={`p-6 rounded-xl shadow-lg relative overflow-hidden group cursor-pointer transition-all duration-700 ${
                            breatheState === 'inhale' ? 'bg-emerald-400 scale-[1.02] text-white shadow-emerald-200' : 
                            breatheState === 'hold' ? 'bg-emerald-500 text-white shadow-emerald-300' :
                            breatheState === 'exhale' ? 'bg-emerald-600 scale-[0.98] text-white' : 
                            'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                    >
                        <div className="relative z-10 text-center">
                            <div className="flex justify-center mb-2">
                                <Wind size={24} className={breatheState !== 'idle' ? "animate-pulse" : ""} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">4-7-8 Breathing</h3>
                            
                            <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-4 transition-all ease-linear ${
                                breatheState === 'inhale' ? 'bg-white/40 scale-125 duration-[4000ms]' : 
                                breatheState === 'hold' ? 'bg-white/30 scale-125 duration-[7000ms]' :
                                breatheState === 'exhale' ? 'bg-white/20 scale-100 duration-[8000ms]' : 
                                'bg-emerald-200/50 scale-100 hover:scale-110 duration-300'
                            }`}>
                                <span className={`text-4xl font-light ${breatheState === 'idle' ? 'hidden' : 'block'}`}>
                                    {breatheTime}
                                </span>
                                <span className={`text-sm font-medium ${breatheState !== 'idle' ? 'hidden' : 'block'}`}>
                                    Start
                                </span>
                            </div>
                            <p className="font-medium h-6">
                                {breatheState === 'inhale' && "Inhale deeply..."}
                                {breatheState === 'hold' && "Hold your breath..."}
                                {breatheState === 'exhale' && "Exhale slowly..."}
                                {breatheState === 'idle' && "Click to center yourself."}
                            </p>
                        </div>
                    </div>

                    {/* Interactive Widget: Hydration Tracker */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-6 rounded-xl shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <div>
                                <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                                    <Droplets size={20} className="text-blue-500" />
                                    Hydration Tracker
                                </h3>
                                <p className="text-blue-600 text-sm">{waterGlasses} / {goalGlasses} glasses today</p>
                            </div>
                        </div>

                        <div className="relative h-24 w-full bg-blue-100/50 rounded-2xl overflow-hidden mb-4 border border-blue-200/50 flex">
                            {/* Water level animation */}
                            <div 
                                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-1000 ease-in-out flex items-start justify-center pt-2"
                                style={{ height: `${Math.min(100, (waterGlasses / goalGlasses) * 100)}%` }}
                            >
                                <div className="w-[150%] h-8 bg-white/20 rounded-[100%] absolute -top-4 animate-[spin_4s_linear_infinite]" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}></div>
                            </div>
                            
                            <div className="absolute inset-0 flex items-center justify-center z-10 font-bold text-3xl text-blue-900 mix-blend-overlay">
                                {Math.round((waterGlasses / goalGlasses) * 100)}%
                            </div>
                        </div>

                        <div className="flex justify-between items-center relative z-10">
                            <button 
                                onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                                className="w-10 h-10 rounded-full bg-white text-blue-500 shadow hover:bg-blue-50 flex items-center justify-center font-bold text-xl transition-transform active:scale-95"
                            >
                                -
                            </button>
                            <span className="text-blue-800 font-medium">Log Water</span>
                            <button 
                                onClick={() => setWaterGlasses(waterGlasses + 1)}
                                className="w-10 h-10 rounded-full bg-blue-500 text-white shadow hover:bg-blue-600 flex items-center justify-center font-bold text-xl transition-transform active:scale-95 hover:shadow-cyan-200"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Wellness;
