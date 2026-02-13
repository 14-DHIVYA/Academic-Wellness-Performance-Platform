import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
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

    // Fetch data
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/wellness", {
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
            await axios.post("http://localhost:5000/api/wellness", formData, {
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
            await axios.delete(`http://localhost:5000/api/wellness/${id}`, {
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
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
                                                    className={`px-2 py-1 rounded-full text-xs ${act.mood === "Happy"
                                                            ? "bg-green-100 text-green-700"
                                                            : act.mood === "Stressed"
                                                                ? "bg-red-100 text-red-700"
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
                                                    className="text-red-500 hover:text-red-700"
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

                {/* Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Wellness Trends</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activities}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="createdAt" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="sleepHours"
                                    stroke="#8884d8"
                                    name="Sleep (h)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="exerciseMinutes"
                                    stroke="#82ca9d"
                                    name="Exercise (m)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Wellness;
