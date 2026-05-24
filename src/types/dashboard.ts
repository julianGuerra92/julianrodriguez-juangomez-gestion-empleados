export interface DashboardFilter {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}

export interface HorasExtrasByMonth {
  mes: number;
  año: number;
  horas: number;
}

export interface IncapacidadPorTipo {
  tipo: string;
  dias: number;
  porcentaje: number;
}

export interface DashboardStats {
  totalHorasExtras: number;
  totalDiasIncapacidad: number;
  totalEmpleados: number; // additional stat could be useful, or we just leave it for now
  cambioHorasExtras: number; // percentage change comparing to previous period
  cambioIncapacidades: number; // percentage change comparing to previous period
}
