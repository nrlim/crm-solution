"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";

interface FunnelData {
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
}

export default function ConversionFunnel() {
  const router = useRouter();
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunnel = async () => {
      try {
        const response = await fetch("/api/analytics/dashboard");
        if (response.status === 401) {
          router.push("/");
          return;
        }
        const data = await response.json();
        setFunnel(data.funnel || {});
      } catch (err) {
        setError("Failed to load funnel data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFunnel();
  }, [router]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-600" />
          Conversion Funnel
        </h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-600" />
          Conversion Funnel
        </h2>
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  if (!funnel) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-600" />
          Conversion Funnel
        </h2>
        <p className="text-slate-500 text-center py-8">No data available</p>
      </div>
    );
  }

  const stages = [
    { label: "New", value: funnel.new, color: "bg-blue-500", percent: 100 },
    {
      label: "Contacted",
      value: funnel.contacted,
      color: "bg-cyan-500",
      percent: funnel.new > 0 ? Math.round((funnel.contacted / funnel.new) * 100) : 0,
    },
    {
      label: "Qualified",
      value: funnel.qualified,
      color: "bg-teal-500",
      percent: funnel.contacted > 0 ? Math.round((funnel.qualified / funnel.contacted) * 100) : 0,
    },
    {
      label: "Converted",
      value: funnel.converted,
      color: "bg-green-500",
      percent: funnel.qualified > 0 ? Math.round((funnel.converted / funnel.qualified) * 100) : 0,
    },
  ];

  const totalLeads = funnel.new || 0;
  const conversionRate = totalLeads > 0 ? Math.round((funnel.converted / totalLeads) * 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-cyan-600" />
        Conversion Funnel
      </h2>

      <div className="space-y-6">
        {stages.map((stage, index) => {
          const width = totalLeads > 0 ? ((stage.value / totalLeads) * 100).toFixed(1) : "0";
          const widthNum = parseFloat(width as string);
          const nextStageValue = stages[index + 1]?.value || 0;
          const dropOff = stage.value - nextStageValue;
          const dropOffPercent = stage.value > 0 ? Math.round((dropOff / stage.value) * 100) : 0;

          return (
            <div key={stage.label}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-slate-900">{stage.label}</h3>
                  <p className="text-sm text-slate-600">
                    {stage.value} leads ({width}% of total)
                  </p>
                </div>
                {index < stages.length - 1 && (
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-600">Conversion</p>
                    <p className="text-lg font-bold text-blue-600">{stage.percent}%</p>
                  </div>
                )}
              </div>

              {/* Funnel bar */}
              <div className="relative mb-2">
                <div className="h-12 rounded-lg overflow-hidden bg-slate-100">
                  <div
                    className={`h-full ${stage.color} opacity-80 flex items-center justify-center text-white font-semibold transition-all duration-300`}
                    style={{ width: `${Math.max(widthNum, 5)}%` }}
                  >
                    {widthNum > 20 && <span className="text-sm">{width}%</span>}
                  </div>
                </div>
              </div>

              {/* Drop-off indicator */}
              {index < stages.length - 1 && dropOff > 0 && (
                <p className="text-xs text-red-600 mb-4">
                  ↓ {dropOff} leads dropped off ({dropOffPercent}%)
                </p>
              )}
            </div>
          );
        })}

        {/* Summary */}
        <div className="border-t border-slate-200 pt-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-slate-600">Total Leads</p>
              <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Converted</p>
              <p className="text-2xl font-bold text-green-600">{funnel.converted}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-blue-600">{conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
