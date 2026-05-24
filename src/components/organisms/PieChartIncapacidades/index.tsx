"use client";

import { IncapacidadPorTipo } from "@/types/dashboard";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PieChartIncapacidadesProps {
  data: IncapacidadPorTipo[];
  title?: string;
}

const COLORS = ["#0ea5e9", "#f43f5e"];

export function PieChartIncapacidades({ data, title = "% Horas Extras vs Días Incapacidades" }: PieChartIncapacidadesProps) {
  const chartData = data.map((item) => ({
    name: item.tipo,
    value: item.porcentaje,
  }));

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border dark:border-zinc-700 w-full flex flex-col min-h-100">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{title}</h3>
      {chartData.length === 0 ? (
        <div className="flex justify-center items-center flex-1 text-zinc-500">Sin datos para mostrar</div>
      ) : (
        <div className="flex-1 w-full min-h-75">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "none", borderRadius: "8px", color: "#f4f4f5" }}
                itemStyle={{ color: "#38bdf8" }}
                formatter={(value: any) => [`${value}%`, "Proporción"]}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
