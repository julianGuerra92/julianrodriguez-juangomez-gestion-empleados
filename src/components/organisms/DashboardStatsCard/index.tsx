"use client";

import { LucideIcon } from "lucide-react";

interface DashboardStatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: number; // percentage change comparing to previous period (optional)
}

export function DashboardStatsCard({ label, value, icon: Icon, change }: DashboardStatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border dark:border-zinc-700 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{label}</span>
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md text-indigo-600 dark:text-indigo-400">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</h3>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            <span
              className={`text-xs font-medium ${
                isPositive ? "text-emerald-600" : isNegative ? "text-rose-600" : "text-zinc-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">vs período anterior</span>
          </div>
        )}
      </div>
    </div>
  );
}
