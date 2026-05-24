"use client";

import { useState } from "react";
import { DashboardFilter as IDashboardFilter, DashboardStats, HorasExtrasByMonth, IncapacidadPorTipo } from "@/types/dashboard";
import { DashboardFilter } from "@/components/molecules/DashboardFilter";
import { BarChartHorasExtras } from "@/components/organisms/BarChartHorasExtras";
import { PieChartIncapacidades } from "@/components/organisms/PieChartIncapacidades";
import { DashboardStatsCard } from "@/components/organisms/DashboardStatsCard";
import { getDashboardStats, getHorasExtrasByMonth, getIncapacidadDistribution } from "@/actions/dashboard";
import { UserListItem } from "@/types/user";
import { Clock, Stethoscope, Users } from "lucide-react";

interface DashboardWrapperProps {
  initialStats: DashboardStats;
  initialHorasExtras: HorasExtrasByMonth[];
  initialIncapacidades: IncapacidadPorTipo[];
  employees: Pick<UserListItem, 'id' | 'name' | 'email'>[];
}

export function DashboardWrapper({ 
  initialStats, 
  initialHorasExtras, 
  initialIncapacidades, 
  employees 
}: DashboardWrapperProps) {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [horasExtras, setHorasExtras] = useState<HorasExtrasByMonth[]>(initialHorasExtras);
  const [incapacidades, setIncapacidades] = useState<IncapacidadPorTipo[]>(initialIncapacidades);
  const [isLoading, setIsLoading] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  const handleFilterChange = async (filter: IDashboardFilter) => {
    setIsLoading(true);
    setFilterActive(Object.keys(filter).length > 0 && Object.values(filter).some(v => v !== undefined));

    try {
      const [newStats, newHorasExtras, newIncapacidades] = await Promise.all([
        getDashboardStats(filter),
        getHorasExtrasByMonth(filter),
        getIncapacidadDistribution(filter),
      ]);

      setStats(newStats);
      setHorasExtras(newHorasExtras);
      setIncapacidades(newIncapacidades);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardFilter 
        employees={employees} 
        onFilterChange={handleFilterChange} 
        isLoading={isLoading} 
      />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardStatsCard 
              label="Total Horas Extras" 
              value={stats.totalHorasExtras} 
              icon={Clock} 
              change={0} 
            />
            <DashboardStatsCard 
              label="Días Incapacidad" 
              value={stats.totalDiasIncapacidad} 
              icon={Stethoscope} 
              change={0} 
            />
            {!filterActive && (
              <DashboardStatsCard 
                label="Total Empleados" 
                value={stats.totalEmpleados} 
                icon={Users} 
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartHorasExtras data={horasExtras} />
            <PieChartIncapacidades data={incapacidades} />
          </div>
        </>
      )}
    </div>
  );
}
