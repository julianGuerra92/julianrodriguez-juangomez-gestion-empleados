"use client";

import { useState } from "react";
import { DashboardFilter as IDashboardFilter } from "@/types/dashboard";
import { EmployeeSelector } from "@/components/molecules/EmployeeSelector";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { Label } from "@/components/atoms/Label";
import { UserListItem } from "@/types/user";

interface DashboardFilterProps {
  employees: Pick<UserListItem, 'id' | 'name' | 'email'>[];
  onFilterChange: (filter: IDashboardFilter) => void;
  isLoading?: boolean;
}

export function DashboardFilter({ employees, onFilterChange, isLoading = false }: DashboardFilterProps) {
  const [employeeId, setEmployeeId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleApply = () => {
    onFilterChange({
      employeeId: employeeId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleReset = () => {
    setEmployeeId("");
    setStartDate("");
    setEndDate("");
    onFilterChange({});
  };

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border dark:border-zinc-700">
      <div className="w-full md:w-64">
        <EmployeeSelector
          employees={employees}
          value={employeeId}
          onChange={setEmployeeId}
          label="Filtrar por empleado"
          allowAllOption={true}
        />
      </div>

      <div className="w-full md:w-auto">
        <Label htmlFor="startDate">Fecha Inicio</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="w-full md:w-auto">
        <Label htmlFor="endDate">Fecha Fin</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate}
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <Button onClick={handleApply} disabled={isLoading}>
          Aplicar Filtro
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          Resetear
        </Button>
      </div>
    </div>
  );
}
