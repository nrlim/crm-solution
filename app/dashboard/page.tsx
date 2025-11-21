'use client';

import { useSession } from 'next-auth/react';
import StatsCards from '@/components/dashboard/StatsCards';
import ConversionFunnel from '@/components/dashboard/ConversionFunnel';
import SmartInsights from '@/components/dashboard/SmartInsights';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-600">
          Here's your CRM dashboard with actionable insights and metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Conversion Funnel */}
      <ConversionFunnel />

      {/* Smart Insights */}
      <SmartInsights />
    </div>
  );
}

