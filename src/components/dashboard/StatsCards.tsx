"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, DollarSign, LayoutGrid } from "lucide-react";

interface Stats {
  totalLeads: number;
  totalContacts: number;
  totalValue: number;
  conversionRate: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/analytics/dashboard");
        const data = await response.json();
        setStats(data.stats || {});
      } catch (err) {
        setError("Failed to load statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-slate-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const cards = [
    {
      label: "Total Leads",
      value: stats.totalLeads,
      icon: LayoutGrid,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
    },
    {
      label: "Total Contacts",
      value: stats.totalContacts,
      icon: Users,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
    },
    {
      label: "Pipeline Value",
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`${card.bgColor} rounded-lg border ${card.borderColor} p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900">{card.value}</p>
              </div>
              <Icon className={`w-8 h-8 ${card.color} opacity-80`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
