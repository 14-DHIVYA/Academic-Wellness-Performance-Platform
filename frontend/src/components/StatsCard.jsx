import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatsCard = ({ title, value, icon, color = "blue", trend }) => {
    const colorMap = {
        blue: "bg-blue-50 text-blue-600 ring-blue-500/20",
        purple: "bg-purple-50 text-purple-600 ring-purple-500/20",
        orange: "bg-orange-50 text-orange-600 ring-orange-500/20",
        green: "bg-green-50 text-green-600 ring-green-500/20",
        indigo: "bg-indigo-50 text-indigo-600 ring-indigo-500/20",
        red: "bg-red-50 text-red-600 ring-red-500/20",
    };

    const activeColorStr = colorMap[color] || colorMap['blue'];

    const isPositive = trend > 0;

    return (
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            {/* Background decorative blob */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl ${activeColorStr.split(' ')[1].replace('text', 'bg')}`} />

            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ring-1 ${activeColorStr} transition-colors`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${isPositive ? 'text-green-600 bg-green-100' : 'text-red-500 bg-red-100'}`}>
                        {isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
    );
};

export default StatsCard;
