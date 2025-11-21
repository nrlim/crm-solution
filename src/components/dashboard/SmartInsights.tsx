"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, AlertCircle, Flame, TrendingDown } from "lucide-react";

interface Insight {
  type: "hot-prospects" | "stale-leads" | "high-value" | "conversion-opportunity" | "activity-needed";
  title: string;
  description: string;
  count: number;
  color: string;
  action: string;
}

export default function SmartInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch("/api/analytics/dashboard");
        const data = await response.json();
        setInsights(data.insights || []);
      } catch (err) {
        setError("Failed to load insights");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-600" />
          Smart Insights
        </h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-600" />
          Smart Insights
        </h2>
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "hot-prospects":
        return <Flame className="w-5 h-5" />;
      case "stale-leads":
        return <TrendingDown className="w-5 h-5" />;
      case "high-value":
        return <TrendingUp className="w-5 h-5" />;
      case "conversion-opportunity":
        return <AlertCircle className="w-5 h-5" />;
      case "activity-needed":
        return <Zap className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      "bg-red-50": "bg-red-50 border-red-200",
      "bg-orange-50": "bg-orange-50 border-orange-200",
      "bg-green-50": "bg-green-50 border-green-200",
      "bg-blue-50": "bg-blue-50 border-blue-200",
      "bg-yellow-50": "bg-yellow-50 border-yellow-200",
    };
    return colorMap[color] || "bg-slate-50 border-slate-200";
  };

  const getTextColor = (color: string) => {
    const colorMap: Record<string, string> = {
      "bg-red-50": "text-red-700",
      "bg-orange-50": "text-orange-700",
      "bg-green-50": "text-green-700",
      "bg-blue-50": "text-blue-700",
      "bg-yellow-50": "text-yellow-700",
    };
    return colorMap[color] || "text-slate-700";
  };

  const getIconColor = (color: string) => {
    const colorMap: Record<string, string> = {
      "bg-red-50": "text-red-600",
      "bg-orange-50": "text-orange-600",
      "bg-green-50": "text-green-600",
      "bg-blue-50": "text-blue-600",
      "bg-yellow-50": "text-yellow-600",
    };
    return colorMap[color] || "text-slate-600";
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
        <Zap className="w-5 h-5 text-cyan-600" />
        Smart Insights
      </h2>

      {insights.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No insights available yet. Add more leads to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.type}
              className={`p-4 rounded-lg border ${getColorClasses(insight.color)} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`${getIconColor(insight.color)}`}>
                  {getIcon(insight.type)}
                </div>
                <span className={`text-2xl font-bold ${getTextColor(insight.color)}`}>
                  {insight.count}
                </span>
              </div>
              <h3 className={`font-semibold ${getTextColor(insight.color)} mb-1 text-sm`}>
                {insight.title}
              </h3>
              <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                {insight.description}
              </p>
              <button className={`text-xs font-medium ${getTextColor(insight.color)} hover:underline`}>
                {insight.action}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
