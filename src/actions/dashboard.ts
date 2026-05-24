"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { DashboardFilter, DashboardStats, HorasExtrasByMonth, IncapacidadPorTipo } from "@/types/dashboard";
import { ROLES } from "@/constants/roles";
import { subMonths, startOfMonth, endOfMonth, differenceInDays } from "date-fns";

export async function getDashboardEmployees() {
  const session = await auth();
  if (!session || session.user.role !== ROLES.ADMIN) {
    throw new Error("No autorizado");
  }

  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { name: "asc" }
  });
}

export async function getDashboardStats(filter?: DashboardFilter): Promise<DashboardStats> {
  const session = await auth();
  if (!session || session.user.role !== ROLES.ADMIN) {
    throw new Error("No autorizado");
  }

  const whereClause: any = {};
  if (filter?.employeeId) {
    whereClause.userId = filter.employeeId;
  }
  
  if (filter?.startDate || filter?.endDate) {
    whereClause.startDate = {};
    if (filter?.startDate) whereClause.startDate.gte = new Date(filter.startDate);
    if (filter?.endDate) whereClause.startDate.lte = new Date(filter.endDate);
  }

  const horasExtras = await prisma.novedad.aggregate({
    where: { ...whereClause, type: "HORA_EXTRA" },
    _sum: { hours: true },
  });

  const incapacidades = await prisma.novedad.findMany({
    where: { ...whereClause, type: "INCAPACIDAD" },
  });

  let totalDiasIncapacidad = 0;
  for (const inc of incapacidades) {
    if (inc.endDate) {
      totalDiasIncapacidad += differenceInDays(inc.endDate, inc.startDate) + 1; // +1 to include both start and end dates
    }
  }

  const totalEmpleados = await prisma.user.count({
    where: filter?.employeeId ? { id: filter.employeeId } : {},
  });

  return {
    totalHorasExtras: horasExtras._sum.hours || 0,
    totalDiasIncapacidad: totalDiasIncapacidad,
    totalEmpleados,
    cambioHorasExtras: 0, // Placeholder
    cambioIncapacidades: 0, // Placeholder
  };
}

export async function getHorasExtrasByMonth(filter?: DashboardFilter): Promise<HorasExtrasByMonth[]> {
  const session = await auth();
  if (!session || session.user.role !== ROLES.ADMIN) {
    throw new Error("No autorizado");
  }

  const whereClause: any = { type: "HORA_EXTRA" };
  if (filter?.employeeId) {
    whereClause.userId = filter.employeeId;
  }
  
  // Set date constraint to last 12 months for chart if not specified
  const now = new Date();
  const twelveMonthsAgo = subMonths(now, 11); // current month counts
  const theStartDate = filter?.startDate ? new Date(filter.startDate) : startOfMonth(twelveMonthsAgo);
  const theEndDate = filter?.endDate ? new Date(filter.endDate) : endOfMonth(now);

  whereClause.startDate = {
    gte: theStartDate,
    lte: theEndDate,
  };

  const novedades = await prisma.novedad.findMany({
    where: whereClause,
    select: { startDate: true, hours: true },
  });

  const grouped = novedades.reduce((acc, current) => {
    if (!current.hours) return acc;
    const year = current.startDate.getFullYear();
    const month = current.startDate.getMonth();
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = { mes: month, año: year, horas: 0 };
    }
    acc[key].horas += current.hours;
    return acc;
  }, {} as Record<string, HorasExtrasByMonth>);

  return Object.values(grouped).sort((a, b) => {
    if (a.año === b.año) return a.mes - b.mes;
    return a.año - b.año;
  });
}

export async function getIncapacidadDistribution(filter?: DashboardFilter): Promise<IncapacidadPorTipo[]> {
  const session = await auth();
  if (!session || session.user.role !== ROLES.ADMIN) {
    throw new Error("No autorizado");
  }

  const whereClause: any = {};
  if (filter?.employeeId) {
    whereClause.userId = filter.employeeId;
  }
  if (filter?.startDate || filter?.endDate) {
    whereClause.startDate = {};
    if (filter?.startDate) whereClause.startDate.gte = new Date(filter.startDate);
    if (filter?.endDate) whereClause.startDate.lte = new Date(filter.endDate);
  }

  // To make a pie chart comparing Hours vs Incapacities roughly (or split by reason)
  const horasExtras = await prisma.novedad.aggregate({
    where: { ...whereClause, type: "HORA_EXTRA" },
    _sum: { hours: true },
  });

  const incapacidades = await prisma.novedad.findMany({
    where: { ...whereClause, type: "INCAPACIDAD" },
  });

  let totalDiasIncapacidad = 0;
  for (const inc of incapacidades) {
    if (inc.endDate) {
      totalDiasIncapacidad += differenceInDays(inc.endDate, inc.startDate) + 1;
    }
  }

  const totalHoras = horasExtras._sum.hours || 0;
  const incapacidadEnHoras = totalDiasIncapacidad * 8; // Assuming 8-hour workday

  const total = totalHoras + incapacidadEnHoras;

  if (total === 0) return [];

  return [
    {
      tipo: "Horas Extras",
      dias: Math.round(totalHoras / 8),
      porcentaje: Math.round((totalHoras / total) * 100),
    },
    {
      tipo: "Días de Incapacidad",
      dias: totalDiasIncapacidad,
      porcentaje: Math.round((incapacidadEnHoras / total) * 100),
    }
  ];
}
