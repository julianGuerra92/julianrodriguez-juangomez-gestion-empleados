"use client";

import { HorasExtrasByMonth } from "@/types/dashboard";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BarChartHorasExtrasProps {
  data: HorasExtrasByMonth[];
  title?: string;
}

export function BarChartHorasExtras({ data, title = "Horas Extras por Mes" }: BarChartHorasExtrasProps) {
  const chartData = data.map((item) => {
    // Generate a valid date using year and month (0-indexed)
    const date = new Date(item.año, item.mes, 1);
    return {
      name: format(date, "MMM yyyy", { locale: es }),
      horas: item.horas,
    };
  });

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border dark:border-zinc-700 w-full h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{title}</h3>
      {chartData.length === 0 ? (
        <div className="flex justify-center items-center h-full text-zinc-500">Sin datos para mostrar</div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fill: "#71717a" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#71717a" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#18181b", border: "none", borderRadius: "8px", color: "#f4f4f5" }}
              itemStyle={{ color: "#38bdf8" }}
              cursor={{ fill: "#f4f4f5", opacity: 0.1 }}
            />
            <Bar dataKey="horas" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
